import { REFINEMENT } from '../../../../config/types';
import { expectedExpression } from './errors';
import { name as namePattern } from './patterns';
import readExpression from '../../readExpression';

export default function readRefinement ( parser ) {
	// if names are relaxed, refinement is strict, meaning no space between reference and refinement
	if ( !parser.relaxedNames ) {
		parser.allowWhitespace();
	}

	// "." name
	if ( parser.matchString( '.' ) ) {
		parser.allowWhitespace();

		const name = parser.matchPattern( namePattern );
		if ( name ) {
			return {
				t: REFINEMENT,
				n: name
			};
		}

		parser.error( 'Expected a property name' );
	}

	// "[" expression "]"
	if ( parser.matchString( '[' ) ) {
		parser.allowWhitespace();

		const expr = readExpression( parser );
		if ( !expr ) parser.error( expectedExpression );

		parser.allowWhitespace();

		if ( !parser.matchString( ']' ) ) parser.error( `Expected ']'` );

		return {
			t: REFINEMENT,
			x: expr
		};
	}

	return null;
}
