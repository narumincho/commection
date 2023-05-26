import 'package:commection/simpleHttpType/url.dart';
import 'package:meta/meta.dart';

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
  });

  final SimpleUrl url;
  final SimpleRequestHeader header;
}

@immutable
class SimpleRequestHeader {
  const SimpleRequestHeader({required this.authorizationBearerValue});

  final String? authorizationBearerValue;
}
