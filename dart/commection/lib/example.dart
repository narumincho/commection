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
final class If<T> implements RequestExpr<T> {
  const If({
    required this.condition,
    required this.thenExpr,
    required this.elseExpr,
  });

  final RequestExpr<bool> condition;
  final RequestExpr<T> thenExpr;
  final RequestExpr<T> elseExpr;

  @override
  Future<T> evaluate(Impliment impliment) async {
    if (await condition.evaluate(impliment)) {
      return thenExpr.evaluate(impliment);
    }
    return elseExpr.evaluate(impliment);
  }
}

@immutable
final class OptionalMatch<T, R> implements RequestExpr<R> {
  const OptionalMatch({
    required this.optional,
    required this.someExpr,
    required this.noneExpr,
  });

  final RequestExpr<T?> optional;
  final RequestExpr<R> Function(RequestExpr<T>) someExpr;
  final RequestExpr<R> noneExpr;

  @override
  Future<R> evaluate(Impliment impliment) async {
    final optionalEvaluted = await optional.evaluate(impliment);
    if (optionalEvaluted == null) {
      return noneExpr.evaluate(impliment);
    }
    return someExpr(Literal(optionalEvaluted)).evaluate(impliment);
  }
}

@immutable
final class Literal<T> implements RequestExpr<T> {
  const Literal(this.value);

  final T value;

  @override
  Future<T> evaluate(Impliment impliment) async {
    return value;
  }
}

@immutable
final class Impliment {
  Impliment({
    required this.hello,
  });

  final Future<String> Function() hello;
}
