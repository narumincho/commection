import 'package:commection/lazy.dart';
import 'package:commection/simpleHttpType/url.dart';
import 'package:meta/meta.dart';
import 'package:narumincho_json/narumincho_json.dart';

@immutable
sealed class SimpleRequest {
  const SimpleRequest();
}

@immutable
final class SimpleRequestGet implements SimpleRequest {
  const SimpleRequestGet({
    required this.url,
  });

  final SimpleUrl url;
}

@immutable
final class SimpleRequestOption implements SimpleRequest {
  const SimpleRequestOption({
    required this.url,
  });

  final SimpleUrl url;
}

@immutable
final class SimpleRequestPost implements SimpleRequest {
  const SimpleRequestPost({
    required this.url,
    required this.header,
    required this.bodyLazy,
  });

  final SimpleUrl url;
  final SimpleRequestHeader header;
  final Lazy<JsonValue> bodyLazy;
}

@immutable
class SimpleRequestHeader {
  const SimpleRequestHeader({required this.authorizationBearerValue});

  final String? authorizationBearerValue;
}
