const modifiers = require('../data/modifiers');
const CQLLibrary = require('../models/cqlLibrary');

module.exports = {
  allGet
};

function allGet(req, res) {
  if (req.user) {
    const editorTypes = [
      'boolean',
      'system_code',
      'system_concept',
      'integer',
      'datetime',
      'decimal',
      'system_quantity',
      'string',
      'time',
      'interval_of_integer',
      'interval_of_datetime',
      'interval_of_decimal',
      'interval_of_quantity'
    ];
    const parentID = req.params.artifact;
    CQLLibrary.find({ linkedArtifactId: parentID }, (error, libraries) => {
      if (!error && libraries.length !== 0) {
        const externalModifiers = [];
        libraries.map(lib => {
          if (
            [
              'CDS_Connect_Commons_for_FHIRv102',
              'CDS_Connect_Commons_for_FHIRv300',
              'CDS_Connect_Commons_for_FHIRv400',
              'CDS_Connect_Conversions',
              'FHIRHelpers'
            ].includes(lib.name)
          )
            return;
          lib.details.functions.forEach(func => {
            // The ExternalModifier requires a functionName, libraryName,
            // arguments, and argumentTypes field that is not on other modifiers.
            // This is needed for the sake of testing whether external CQL libraries
            // can be deleted or updated or used as modifiers, by checking these details.
            if (
              func.operand.length >= 1 &&
              func.argumentTypes.length >= 1 &&
              func.argumentTypes.slice(1).every(type => editorTypes.includes(type.calculated))
            ) {
              const functionAndLibraryName = `${func.name} (from ${lib.name})`;
              const modifier = {
                id: functionAndLibraryName,
                type: 'ExternalModifier',
                name: functionAndLibraryName,
                inputTypes: func.inputTypes,
                returnType: func.calculatedReturnType,
                cqlTemplate: 'ExternalModifier',
                cqlLibraryFunction: `"${lib.name}"."${func.name}"`,
                values: { value: [] },
                functionName: func.name,
                libraryName: lib.name,
                arguments: func.operand,
                argumentTypes: func.argumentTypes
              };
              externalModifiers.push(modifier);
            }
          });
        });
        res.json(modifiers.concat(externalModifiers));
      } else {
        res.json(modifiers);
      }
    });
  } else {
    res.sendStatus(401);
  }
}
