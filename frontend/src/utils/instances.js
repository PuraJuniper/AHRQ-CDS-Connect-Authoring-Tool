import Validators from './validators';
import _ from 'lodash';

export function validateModifier(modifier) {
  let validationWarning = null;

  if (modifier && modifier.validator) {
    const validator = Validators[modifier.validator.type];
    const values = modifier.validator.fields.map(v => modifier.values && modifier.values[v]);
    const args = modifier.validator.args ? modifier.validator.args.map(v => modifier.values[v]) : [];
    if (!validator.check(values, args)) {
      validationWarning = validator.warning(modifier.validator.fields, modifier.validator.args);
    }
  }
  return validationWarning;
}

// Gets the returnType of the last valid modifier
export function getReturnType(startingReturnType, modifiers = []) {
  let returnType = startingReturnType;
  if (modifiers.length === 0) return returnType;

  for (let index = modifiers.length - 1; index >= 0; index--) {
    const modifier = modifiers[index];
    // Check to see if the modifier is a user-built one.
    if (modifier.where) {
      returnType = modifier.returnType;
    } else if (validateModifier(modifier) === null) {
      returnType = modifier.returnType;
      break;
    }
  }

  return returnType;
}

export function allModifiersValid(modifiers) {
  if (!modifiers) return true;

  let areAllModifiersValid = true;
  modifiers.forEach(modifier => {
    if (validateModifier(modifier) !== null) areAllModifiersValid = false;
  });
  return areAllModifiersValid;
}

export function getFieldWithType(fields, type) {
  return fields.find(f => f.type && f.type.endsWith(type));
}

export function getFieldWithId(fields, id) {
  return fields.find(f => f.id === id);
}

export function getElementTemplate(elementTemplateGroups, templateId) {
  let elementTemplate;
  elementTemplateGroups.find(templateGroup => {
    elementTemplate = templateGroup.entries.find(template => template.id === templateId);
    return elementTemplate !== undefined;
  });

  return _.cloneDeep(elementTemplate).filter(template => !template.suppress);
}

export function getInstanceByReference(allInstances, referenceField) {
  return allInstances.find(instance => Boolean(instance.fields.find(field => _.isEqual(field, referenceField))));
}

export function getInstanceById(allInstances, instanceId) {
  return allInstances.find(instance => instance.uniqueId === instanceId);
}
