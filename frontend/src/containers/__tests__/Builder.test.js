import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore as reduxCreateMockStore } from 'redux-test-utils';
import _ from 'lodash';
import nock from 'nock';
import * as types from 'actions/types';
import mockModifiers from 'mocks/modifiers/mockModifiers';
import { render, fireEvent, userEvent, screen, waitFor, within } from 'utils/test-utils';
import { instanceTree, artifact, reduxState } from 'utils/test_fixtures';
import { simpleObservationInstanceTree } from 'utils/test_fixtures';
import { simpleConditionInstanceTree } from 'utils/test_fixtures';
import { simpleProcedureInstanceTree } from 'utils/test_fixtures';
import { simpleImmunizationInstanceTree } from 'utils/test_fixtures';
import { getFieldWithId } from 'utils/instances';
import Builder from '../Builder';
import { mockArtifact } from 'mocks/artifacts';
import { mockExternalCqlLibrary } from 'mocks/external-cql';
import { mockTemplates } from 'mocks/templates';

const modifiersByInputType = {};

mockModifiers.forEach(modifier => {
  modifier.inputTypes.forEach(inputType => {
    modifiersByInputType[inputType] = (modifiersByInputType[inputType] || []).concat(modifier);
  });
});

const defaultState = {
  ...reduxState,
  artifacts: {
    ...reduxState.artifacts,
    artifact: {
      ...artifact,
      expTreeInclude: instanceTree
    }
  },
  modifiers: {
    ...reduxState.modifiers
  },
  navigation: {
    activeTab: 1,
    scrollToId: null
  }
};

const getDefaultStateWithInstanceTree = instanceTree => {
  return {
    ...reduxState,
    artifacts: {
      ...reduxState.artifacts,
      artifact: {
        ...artifact,
        expTreeInclude: instanceTree
      }
    },
    modifiers: {
      ...reduxState.modifiers
    },
    navigation: {
      activeTab: 1,
      scrollToId: null
    }
  };
};

const createMockStore = state => {
  const store = reduxCreateMockStore(state);
  const { dispatch } = store;

  store.dispatch = (...args) => {
    dispatch(...args);
    return Promise.resolve({ templates: state.templates.templates });
  };

  return store;
};

const expandAction = action => {
  if (typeof action !== 'function') return action;
  let args;
  action(actionArgs => (args = actionArgs));
  return args;
};

describe('<Builder />', () => {
  const renderComponent = ({ store = createMockStore(defaultState), ...props } = {}) =>
    render(
      <Provider store={store}>
        <Builder match={{ params: {} }} {...props} />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get('/authoring/api/config/valuesets/demographics/units_of_time')
      .reply(200, { expansion: [] })
      .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
      .reply(200, [mockExternalCqlLibrary])
      .get(`/authoring/api/modifiers/${mockArtifact._id}`)
      .reply(200, mockModifiers)
      .get('/authoring/api/config/templates')
      .reply(200, mockTemplates);
  });
  afterEach(() => nock.cleanAll());

  it('can edit a template instance', async () => {
    const store = createMockStore(defaultState);
    renderComponent({ store });

    fireEvent.change(document.querySelector('input[type=text]'), {
      target: { value: '30 to 45' }
    });

    const updateAction = expandAction(_.last(store.getActions()));
    const nameField = getFieldWithId(updateAction.artifact.expTreeInclude.childInstances[0].fields, 'element_name');

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(nameField.value).toEqual('30 to 45');
  });

  it('can edit a conjunction instance', async () => {
    const store = createMockStore(defaultState);
    renderComponent({ store });

    userEvent.click(screen.getAllByRole('button', { name: 'And' })[0]);
    userEvent.click(screen.getByText('Or'));

    const updateAction = expandAction(_.last(store.getActions()));
    const instance = updateAction.artifact.expTreeInclude;

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(instance.id).toEqual('Or');
    expect(instance.name).toEqual('Or');
  });

  it('can delete an instance', () => {
    const store = createMockStore({
      ...defaultState,
      artifacts: {
        ...defaultState.artifacts,
        artifact: {
          ...artifact,
          expTreeInclude: {
            ...instanceTree,
            childInstances: instanceTree.childInstances.slice(0, 1)
          }
        }
      }
    });

    renderComponent({ store });

    fireEvent.click(screen.getByLabelText('remove Age Range'));
    fireEvent.click(screen.getByText('Delete'));

    const updateAction = expandAction(_.last(store.getActions()));

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(updateAction.artifact.expTreeInclude.childInstances).toHaveLength(0);
  });

  describe('Test that certain modifiers appear given current return type of list_of_observations', () => {
    beforeEach(() => {
      nock('http://localhost')
        .get('/authoring/api/config/valuesets/demographics/units_of_time')
        .reply(200, { expansion: [] });
    });

    describe('Test FirstObservation modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleObservationInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        renderComponent({ store });

        userEvent.click((await screen.findAllByRole('button', { name: /Add Modifiers/i }, { timeout: 30000 }))[0]);
        const modal = within(await screen.findByRole('dialog'));
        userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]);
        userEvent.click(modal.getByLabelText('Select modifier...'));
        await waitFor(() => userEvent.click(within(screen.queryByRole('listbox')).getByText('First')));
        userEvent.click(modal.getByRole('button', { name: 'Add' }));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('FirstObservation');
        expect(modifier.name).toEqual('First');
      });
    });

    describe('Test AverageObservationValue modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleObservationInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        renderComponent({ store });

        userEvent.click((await screen.findAllByRole('button', { name: /Add Modifiers/i }, { timeout: 30000 }))[0]);
        const modal = within(await screen.findByRole('dialog'));
        userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]);
        userEvent.click(modal.getByLabelText('Select modifier...'));
        await waitFor(() =>
          userEvent.click(within(screen.queryByRole('listbox')).getByText('Average Observation Value'))
        );
        userEvent.click(modal.getByRole('button', { name: 'Add' }));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('AverageObservationValue');
        expect(modifier.name).toEqual('Average Observation Value');
      });
    });

    describe('Test FirstCondition Modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleConditionInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        renderComponent({ store });

        userEvent.click((await screen.findAllByRole('button', { name: /Add Modifiers/i }, { timeout: 30000 }))[0]);
        const modal = within(await screen.findByRole('dialog'));
        userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]);
        userEvent.click(modal.getByLabelText('Select modifier...'));
        await waitFor(() => userEvent.click(within(screen.queryByRole('listbox')).getByText('First')));
        userEvent.click(modal.getByRole('button', { name: 'Add' }));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('FirstCondition');
        expect(modifier.name).toEqual('First');
      });
    });

    describe('Test FirstProcedure Modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleProcedureInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        renderComponent({ store });

        userEvent.click((await screen.findAllByRole('button', { name: /Add Modifiers/i }, { timeout: 30000 }))[0]);
        const modal = within(await screen.findByRole('dialog'));
        userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]);
        userEvent.click(modal.getByLabelText('Select modifier...'));
        await waitFor(() => userEvent.click(within(screen.queryByRole('listbox')).getByText('First')));
        userEvent.click(modal.getByRole('button', { name: 'Add' }));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('FirstProcedure');
        expect(modifier.name).toEqual('First');
      });
    });

    describe('Test FirstImmunization Modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleImmunizationInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        renderComponent({ store });

        userEvent.click((await screen.findAllByRole('button', { name: /Add Modifiers/i }, { timeout: 30000 }))[0]);
        const modal = within(await screen.findByRole('dialog'));
        userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]);
        userEvent.click(modal.getByLabelText('Select modifier...'));
        await waitFor(() => userEvent.click(within(screen.queryByRole('listbox')).getByText('First')));
        userEvent.click(modal.getByRole('button', { name: 'Add' }));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('FirstImmunization');
        expect(modifier.name).toEqual('First');
      });
    });
  });
});
