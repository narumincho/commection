import 'package:meta/meta.dart';

@immutable
sealed class RequestExpr<T> {
  Future<T> evaluate(Impliment impliment);
}

@immutable
final class Hello implements RequestExpr<String> {
  @override
  Future<String> evaluate(Impliment impliment) {
    return impliment.hello();
  }
}

@immutable
final class TextLiteral implements RequestExpr<String> {
  const TextLiteral(this.value);

  final String value;

  @override
  Future<String> evaluate(Impliment impliment) async {
    return value;
  }
}

@immutable
final class TextJoin implements RequestExpr<String> {
  const TextJoin(this.left, this.right);

  final RequestExpr<String> left;
  final RequestExpr<String> right;

  @override
  Future<String> evaluate(Impliment impliment) async {
    return (await left.evaluate(impliment)) + (await right.evaluate(impliment));
  }
}

@immutable
final class TextIsEmpty implements RequestExpr<bool> {
  const TextIsEmpty(this.expr);

  final RequestExpr<String> expr;

  @override
  Future<bool> evaluate(Impliment impliment) async {
    return (await expr.evaluate(impliment)).isEmpty;
  }
}

@immutable
final class Impliment {
  Impliment({
    required this.hello,
  });

  final Future<String> Function() hello;
}
