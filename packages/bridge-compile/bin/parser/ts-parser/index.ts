import ts from 'typescript';
import { JSONTypeI } from '../../types';
import { createJSONType } from './create-json-type';
import { cleanJSONType } from '../transform-json-type';

/**
 *
 * WARNING:
 * This is not at all the best way to extract the type of the bridge project
 * If all the parameters of the initBridge function are not declared outside any closure,
 * the code wont work
 *
 * TO-DO
 * - [ ] Find with ts AST where is the initBridge call and extract the type from there
 */
export default (sourceFilePath: string): JSONTypeI => {
  try {
    const program: ts.Program = ts.createProgram([sourceFilePath], {
      // allowJs: true,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.CommonJS,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      strict: true,
      noErrorTruncation: true,
      forceConsistentCasingInFileNames: true,
      skipLibCheck: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      resolveJsonModule: true,
      moduleResolution: 2,
    });

    const checker: ts.TypeChecker = program.getTypeChecker();

    const sourceFile = program.getSourceFile(sourceFilePath);
    if (!sourceFile) throw new Error('Program failed to laod sourceFile');

    let BridgeGenereatedTypeNode: ts.Node = null as any;

    ts.forEachChild(sourceFile, (node) => {
      if (ts.isTypeAliasDeclaration(node) && node.name.escapedText === 'BridgeGenereatedType')
        BridgeGenereatedTypeNode = node;
    });

    if (!BridgeGenereatedTypeNode) throw new Error('TS Node not found');

    const JSONType = cleanJSONType(
      createJSONType(checker, checker.getTypeAtLocation(BridgeGenereatedTypeNode), BridgeGenereatedTypeNode)
    );

    return JSONType;
  } catch (err) {
    console.error(err);
    return { primitive: 'unrecognized', value: `Error in program load` };
  }
};
