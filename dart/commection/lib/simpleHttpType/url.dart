import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:meta/meta.dart';

///  Trailing Slash とか気にしなくて良い構造化された読み取り専用のURL
@immutable
class SimpleUrl {
  SimpleUrl({
    required this.origin,
    required this.pathSegments,
    required this.query,
  });

  final String origin;
  final IList<String> pathSegments;
  final IMap<String, String> query;
}
