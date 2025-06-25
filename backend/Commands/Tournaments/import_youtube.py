import click


@click.command("import_youtube")
@click.argument("url")
def import_youtube(url):
    """Importiert Daten von einem YouTube-Video."""

    print("Importiere YouTube-Daten von URL:", url)
