import 'package:meta/meta.dart';

@immutable
sealed class RequestExpr<T> {
  Future<T> evaluate(Implement implement);
}

@immutable
final class Hello implements RequestExpr<String> {
  @override
  Future<String> evaluate(Implement implement) {
    return implement.hello();
  }
}

@immutable
final class TextLiteral implements RequestExpr<String> {
  const TextLiteral(this.value);

  final String value;

  @override
  Future<String> evaluate(Implement implement) async {
    return value;
  }
}

@immutable
final class TextJoin implements RequestExpr<String> {
  const TextJoin(this.left, this.right);

  final RequestExpr<String> left;
  final RequestExpr<String> right;

  @override
  Future<String> evaluate(Implement implement) async {
    return (await left.evaluate(implement)) + (await right.evaluate(implement));
  }
}

@immutable
final class TextIsEmpty implements RequestExpr<bool> {
  const TextIsEmpty(this.expr);

  final RequestExpr<String> expr;

  @override
  Future<bool> evaluate(Implement implement) async {
    return (await expr.evaluate(implement)).isEmpty;
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
  Future<T> evaluate(Implement implement) async {
    if (await condition.evaluate(implement)) {
      return thenExpr.evaluate(implement);
    }
    return elseExpr.evaluate(implement);
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
  Future<R> evaluate(Implement implement) async {
    final optionalEvaluted = await optional.evaluate(implement);
    if (optionalEvaluted == null) {
      return noneExpr.evaluate(implement);
    }
    return someExpr(Literal(optionalEvaluted)).evaluate(implement);
  }
}

@immutable
final class Literal<T> implements RequestExpr<T> {
  const Literal(this.value);

  final T value;

  @override
  Future<T> evaluate(Implement implement) async {
    return value;
  }
}

@immutable
final class Implement {
  Implement({
    required this.hello,
  });

  final Future<String> Function() hello;
}
