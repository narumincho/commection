import 'package:meta/meta.dart';

@immutable
sealed class SimpleResponse {
  const SimpleResponse();
}

@immutable
final class SimpleResponseOk implements SimpleResponse {
  const SimpleResponseOk(this.body);
  final SimpleResponseBody body;
}

@immutable
final class SimpleResponseNotFoundError implements SimpleResponse {
  const SimpleResponseNotFoundError();
}

@immutable
sealed class SimpleResponseBody {
  const SimpleResponseBody();
}

@immutable
final class SimpleResponseBodyHtml implements SimpleResponseBody {
  const SimpleResponseBodyHtml(this.html);
  final StructuredHtml html;
}

@immutable
final class SimpleResponseBodyPng implements SimpleResponseBody {
  const SimpleResponseBodyPng(this.png);
  final Uint8List png;
}

@immutable
final class SimpleResponseBodyJs implements SimpleResponseBody {
  const SimpleResponseBodyJs(this.js);
  final String js;
}
