import 'package:commection/example.dart';
import 'package:test/test.dart';

void main() {
  final impliment = Impliment(hello: () async {
    return 'ok!!!';
  });

  test('text is empty', () async {
    expect(await TextIsEmpty(TextLiteral('')).evaluate(impliment), true);
  });

  test('text join', () async {
    expect(
      await TextJoin(TextLiteral('sample: '), Hello()).evaluate(impliment),
      'sample: ok!!!',
    );
  });

  test('if', () async {
    expect(
      await If(
        condition: TextIsEmpty(TextLiteral('aa')),
        thenExpr: TextLiteral('T'),
        elseExpr: TextLiteral('F'),
      ).evaluate(impliment),
      'F',
    );
  });

  test('optional match', () async {
    expect(
      await OptionalMatch(
        optional: TextLiteral('aa'),
        someExpr: (value) => TextJoin( TextLiteral('Some('), value),
        noneExpr: TextLiteral('None'),
      ).evaluate(impliment),
      'Some(aa',
    );
  });
}
