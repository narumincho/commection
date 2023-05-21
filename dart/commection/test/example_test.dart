import 'package:commection/example.dart';
import 'package:test/test.dart';

void main() {
  final impliment = Impliment(hello: () async {
    return 'ok!!!';
  });

  test('text is empty', () {
    expect(TextIsEmpty(TextLiteral('')).evaluate(impliment), true);
  });

  test('text join', () {
    expect(
      TextJoin(TextLiteral('sample:'), Hello()).evaluate(impliment),
      'sample: ok!!!',
    );
  });
}
