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
}
