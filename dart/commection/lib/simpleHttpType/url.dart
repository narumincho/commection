import 'package:fast_immutable_collections/fast_immutable_collections.dart';
import 'package:meta/meta.dart';
import 'package:narumincho_util/narumincho_util.dart';

/// Structured, read-only URLs
/// where you don't have to worry about Trailing Slash or anything else
@immutable
class SimpleUrl {
  const SimpleUrl({
    required this.origin,
    required this.pathSegments,
    required this.query,
  });

  factory SimpleUrl.fromUri(Uri uri) {
    return SimpleUrl(
      origin: uri.origin,
      pathSegments: IList(uri.pathSegments.mapAndRemoveNull(
        (element) => NonEmptyString.fromString(element),
      )),
      query: IMap.fromEntries(uri.queryParameters.entries.mapAndRemoveNull(
        (entry) {
          final key = NonEmptyString.fromString(entry.key);
          return key == null ? null : MapEntry(key, entry.value);
        },
      )),
    );
  }

  final String origin;
  final IList<NonEmptyString> pathSegments;
  final IMap<NonEmptyString, String> query;
}
