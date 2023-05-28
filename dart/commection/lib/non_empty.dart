import 'package:meta/meta.dart';

@immutable
final class NonEmptyString {
  const NonEmptyString._(this.value);

  static NonEmptyString? fromString(String value) {
    if (value.isEmpty) {
      return null;
    }
    return NonEmptyString._(value);
  }

  final String value;

  @override
  int get hashCode => value.hashCode;

  @override
  bool operator ==(Object other) =>
      other is NonEmptyString && other.value == value;
}
