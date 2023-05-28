import 'package:meta/meta.dart';
import 'package:narumincho_util/narumincho_util.dart';

@immutable
final class Server<ImplementType, RequestExpr> {
  const Server({
    required this.schema,
    required this.implementation,
  });

  final Schema<ImplementType, RequestExpr> schema;
  final ImplementType implementation;
}

@immutable
class Schema<ImplementType, RequestExpr> {
  const Schema({required this.name});

  final NonEmptyString name;
}
