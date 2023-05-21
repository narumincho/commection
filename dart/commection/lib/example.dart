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
final class StringLiteral implements RequestExpr<String> {
  const StringLiteral(this.value);

  final String value;

  @override
  Future<String> evaluate(Impliment impliment) async {
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
