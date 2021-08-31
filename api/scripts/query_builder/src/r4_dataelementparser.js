var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var dataElements = require('../data/r4_dataelements.json');
var resources = require('./resources.js').supportedResourceProperties;

let generatedResources = [];
// For each resource in the datafile
resources.forEach(resource => {
  // Add a resource object
  let resourceToPush = { name: resource.name, properties: [] };
  // For each property in the datafile
  resource.properties.forEach(property => {
    // Skip the property depending on its availability
    if (property.availability['r4'] === false) return;

    // Try to find it
    let propertyName = property.name.r4 || property.name.default;
    let propertyIsChoice = propertyName.endsWith('[x]');
    let propertyHasPredefinedConcepts =
      property.predefinedConceptCodes && property.predefinedConceptCodes['r4'].length != 0 ? true : false;
    let dataElementPropertyIndex = dataElements.entry.findIndex(
      entry => entry.resource.name === resource.name + '.' + propertyName
    );
    // If it exists, add it and its type and if it has predefined values.
    if (dataElementPropertyIndex != -1) {
      // Try to find its type
      let typeObjectIndexInElement = dataElements.entry[dataElementPropertyIndex].resource.snapshot.element.findIndex(
        element => element.path === resource.name + '.' + propertyName
      );
      // If the type exists, grab it.
      if (typeObjectIndexInElement != -1) {
        let propertyType =
          dataElements.entry[dataElementPropertyIndex].resource.snapshot.element[typeObjectIndexInElement].type[0].code;
        let propertyCardinalityMax =
          dataElements.entry[dataElementPropertyIndex].resource.snapshot.element[typeObjectIndexInElement].max;
        let propertyModifierType = propertyCardinalityMax === '*' ? 'ListTypeSpecifier' : 'NamedTypeSpecifier';
        if (!propertyIsChoice) {
          // If the property has predefined concept codes, push them to the resultant type
          let propertyToPush = {
            name: propertyName,
            typeSpecifier: {
              type: propertyModifierType,
              elementType: 'FHIR.' + propertyType
            }
          };
          console.log(
            '\tFound resource property',
            `${resource.name}.${propertyName}`,
            'with type:',
            'FHIR.' + propertyType
          );
          if (propertyHasPredefinedConcepts) {
            if (property.predefinedConceptSystem && property.predefinedConceptSystem['r4']) {
              propertyToPush['predefinedSystem'] = property.predefinedConceptSystem['r4'];
            }
            propertyToPush['predefinedCodes'] = property.predefinedConceptCodes['r4'];
            propertyToPush['allowsCustomCodes'] = property.allowsCustomCodes ? true : false;
            property.predefinedConceptCodes['r4'].forEach(predefCode => {
              console.log('\t\t-', predefCode);
            });
          }
          resourceToPush.properties.push(propertyToPush);
          // Result if the resource is a choice property (add all the expanded resource names.)
        } else {
          let choices = [];
          dataElements.entry[dataElementPropertyIndex].resource.snapshot.element[typeObjectIndexInElement].type
            .map(type => type.code)
            .forEach(type => {
              console.log(
                '\tFound resource property',
                `${resource.name}.${propertyName.slice(0, -3) + _.upperFirst(type)}`,
                'with type:',
                'FHIR.' + type
              );
              choices.push({
                name: propertyName.slice(0, -3) + _.upperFirst(type),
                typeSpecifier: { type: propertyModifierType, elementType: 'FHIR.' + type }
              });
            });
          resourceToPush.properties.push({
            name: propertyName.slice(0, -3),
            typeSpecifier: { type: 'ChoiceTypeSpecifier', elementType: choices }
          });
        }
      }
    } else console.log('Failed to find', `${resource.name}.${propertyName}`);
  });

  if (resourceToPush.properties.length != 0) generatedResources.push(resourceToPush);
});

let userWarning = 'This file was autogenerated -- DO NOT EDIT!';

// Write the parsed model to a file.

fs.writeFile(
  path.join(__dirname, '../../../data/query_builder', 'r4_resources.json'),
  JSON.stringify({ note: userWarning, resources: generatedResources }, null, 2),
  err => {
    if (err) {
      console.error(err);
      return;
    }
  }
);
