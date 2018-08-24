import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import ConjunctionGroup from './ConjunctionGroup';

export default class Subpopulation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: this.props.subpopulation.expanded || false
    };
  }

  expand = () => {
    this.setState({ isExpanded: true });
  }

  collapse = () => {
    this.setState({ isExpanded: false });
  }

  addInstance = (name, template, path) => {
    this.props.addInstance(name, template, path, this.props.subpopulation.uniqueId);
  }

  getAllInstances = treeName => this.props.getAllInstances(treeName, null, this.props.subpopulation.uniqueId)

  editInstance = (treeName, params, path, editingConjunction) => {
    this.props.editInstance(treeName, params, path, editingConjunction, this.props.subpopulation.uniqueId);
  }

  deleteInstance = (treeName, path, toAdd) => {
    this.props.deleteInstance(treeName, path, toAdd, this.props.subpopulation.uniqueId);
  }

  onEnterKey = (e) => {
    e.which = e.which || e.keyCode;
    if (e.which === 13) {
      if (this.state.isExpanded) this.collapse();
      else this.expand();
    }
  }

  render() {
    const duplicateNameIndex = this.props.instanceNames.findIndex(name =>
      name.id !== this.props.subpopulation.uniqueId && name.name === this.props.subpopulation.subpopulationName);
    return (
      <div className="subpopulation card-group card-group__top">
        <div className="card-element">
          <div className="card-element__header">
            {this.state.isExpanded ?
              <div className="subpopulation__title">
                <FontAwesome fixedWidth name='angle-double-down'
                  id="collapse-icon"
                  tabIndex="0"
                  onClick={this.state.isExpanded ? this.collapse : this.expand}
                  onKeyPress={this.onEnterKey}
                />

                <input
                  type="text"
                  className="subpopulation__name-input"
                  title="Subpopulation Title"
                  aria-label="Subpopulation Title"
                  value={this.props.subpopulation.subpopulationName}
                  onClick={event => event.stopPropagation()}
                  onChange={(event) => {
                    this.props.setSubpopulationName(event.target.value, this.props.subpopulation.uniqueId);
                  }}
                />
                {duplicateNameIndex !== -1
                  && <div className='warning'>Warning: Name already in use. Choose another name.</div>}
              </div>
            :
              <div className="subpopulation-title">
                <FontAwesome fixedWidth name='angle-double-right'
                  id="collapse-icon"
                  tabIndex="0"
                  onClick={this.state.isExpanded ? this.collapse : this.expand}
                  onKeyPress={this.onEnterKey} />
                <h4>{this.props.subpopulation.subpopulationName}</h4>
              </div>
            }

            <div className="card-element__buttons">
              <button className="secondary-button" onClick={this.state.isExpanded ? this.collapse : this.expand}>
                {this.state.isExpanded ? 'Done' : 'Edit'}
              </button>

              <button
                aria-label="Remove subpopulation"
                className="secondary-button"
                onClick={() => this.props.deleteSubpopulation(this.props.subpopulation.uniqueId)}>
                <FontAwesome fixedWidth name='times' />
              </button>
            </div>
          </div>

          {this.state.isExpanded && this.renderContents()}
        </div>
      </div>
    );
  }

  renderContents() {
    return (
      <div className="card-element__body">
              {this.props.subpopulation.childInstances && this.props.subpopulation.childInstances.length < 1 &&
                <div className='warning'>This subpopulation needs at least one condition</div>
              }
              <ConjunctionGroup
                root={true}
                treeName={this.props.treeName}
                artifact={this.props.artifact}
                templates={this.props.templates}
                valueSets={this.props.valueSets}
                loadValueSets={this.props.loadValueSets}
                instance={this.props.subpopulation}
                addInstance={this.addInstance}
                editInstance={this.editInstance}
                deleteInstance={this.deleteInstance}
                getAllInstances={this.getAllInstances}
                updateInstanceModifiers={this.props.updateInstanceModifiers}
                parameters={this.props.parameters}
                subelements={this.props.subelements}
                subPopulationIndex={this.props.subpopulationIndex}
                conversionFunctions={this.props.conversionFunctions}
                instanceNames={this.props.instanceNames}
                loginVSACUser={this.props.loginVSACUser}
                setVSACAuthStatus={this.props.setVSACAuthStatus}
                vsacStatus={this.props.vsacStatus}
                vsacStatusText={this.props.vsacStatusText}
                timeLastAuthenticated={this.props.timeLastAuthenticated}
                searchVSACByKeyword={this.props.searchVSACByKeyword}
                isSearchingVSAC={this.props.isSearchingVSAC}
                vsacSearchResults={this.props.vsacSearchResults}
                vsacSearchCount={this.props.vsacSearchCount}
                getVSDetails={this.props.getVSDetails}
                isRetrievingDetails={this.props.isRetrievingDetails}
                vsacDetailsCodes={this.props.vsacDetailsCodes}
                vsacFHIRCredentials={this.props.vsacFHIRCredentials}
                validateReturnType={this.props.validateReturnType}
                isValidatingCode={this.props.isValidatingCode}
                isValidCode={this.props.isValidCode}
                codeData={this.props.codeData}
                validateCode={this.props.validateCode}
                resetCodeValidation={this.props.resetCodeValidation}/>
            </div>
    );
  }
}

Subpopulation.propTypes = {
  artifact: PropTypes.object.isRequired,
  valueSets: PropTypes.array,
  loadValueSets: PropTypes.func.isRequired,
  subpopulation: PropTypes.object.isRequired,
  subpopulationIndex: PropTypes.number.isRequired,
  setSubpopulationName: PropTypes.func.isRequired,
  deleteSubpopulation: PropTypes.func.isRequired,
  addInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  treeName: PropTypes.string.isRequired,
  parameters: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  conversionFunctions: PropTypes.array,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  timeLastAuthenticated: PropTypes.instanceOf(Date),
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired
};
