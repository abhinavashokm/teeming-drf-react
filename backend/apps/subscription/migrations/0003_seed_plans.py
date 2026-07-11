from django.db import migrations

free_plan_code = 'free'

def create_plans(apps, schema_editor):
    """create default free plan"""

    Plan = apps.get_model("subscription", "Plan")
    Plan.objects.get_or_create(
        code=free_plan_code,
        defaults={
            "name": "Free",
            "description": "Free plan",
            "max_goals": 3,
            "max_members": 3,
            "tier": 0,
        },
    )


def remove_plans(apps, schema_editor):
    """for migrating backwards"""

    Plan = apps.get_model("subscription", "Plan")
    Plan.objects.filter(code=free_plan_code).delete()


class Migration(migrations.Migration):
    dependencies = [("subscription", "0002_initial")]
    operations = [migrations.RunPython(create_plans, remove_plans)]
