import 'package:commection/example.dart';
import 'package:test/test.dart';

void main() {
  final implement = Implement(hello: () async {
    return 'ok!!!';
  });

  test('text is empty', () async {
    expect(await TextIsEmpty(TextLiteral('')).evaluate(implement), true);
  });

  test('text join', () async {
    expect(
      await TextJoin(TextLiteral('sample: '), Hello()).evaluate(implement),
      'sample: ok!!!',
    );
  });

  test('if true', () async {
    expect(
      await If(
        condition: TextIsEmpty(TextLiteral('')),
        thenExpr: TextLiteral('T'),
        elseExpr: TextLiteral('F'),
      ).evaluate(implement),
      'T',
    );
  });

  test('if false', () async {
    expect(
      await If(
        condition: TextIsEmpty(TextLiteral('aa')),
        thenExpr: TextLiteral('T'),
        elseExpr: TextLiteral('F'),
      ).evaluate(implement),
      'F',
    );
  });

  test('optional match', () async {
    expect(
      await OptionalMatch(
        optional: TextLiteral('aa'),
        someExpr: (value) => TextJoin(TextLiteral('Some('), value),
        noneExpr: TextLiteral('None'),
      ).evaluate(implement),
      'Some(aa',
    );
  });
}
