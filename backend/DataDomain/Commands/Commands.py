import importlib
import os
import pkgutil

import click


def register_commands(app) -> None:
    commands_dir: str = os.path.dirname(__file__)

    for finder, name, ispkg in pkgutil.walk_packages(
            [commands_dir], "DataDomain.Commands."):
        if name.endswith(".Commands") or name.endswith(".__init__"):
            continue

        module = importlib.import_module(name)
        for obj_name in dir(module):
            obj = getattr(module, obj_name)

            try:
                if isinstance(obj, (click.Command, click.Group)):
                    app.cli.add_command(obj)
            except ImportError:
                pass
