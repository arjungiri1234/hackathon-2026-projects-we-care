class MealPlan {
  final String title;
  final String summary;
  final List<String> ingredientsUsed;
  final List<String> steps;
  final String reason;

  MealPlan({
    required this.title,
    required this.summary,
    required this.ingredientsUsed,
    required this.steps,
    required this.reason,
  });
}
