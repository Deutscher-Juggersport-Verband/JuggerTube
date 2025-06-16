import os
from collections import defaultdict

import yaml
from flask import Blueprint

from DataDomain.Model import Response

externalApiFolder = Blueprint(
    'external_api',
    __name__,
    static_folder=os.path.join(
        '/app/ExternalApi')
)


class GetSwaggerFileHandler:
    """Handler for getting swagger file"""

    def handle(self) -> Response:
        """Get swagger file"""

        yaml_files = []

        for root, dirs, files in os.walk(externalApiFolder.static_folder):
            for file in files:
                if file.endswith('.yaml'):
                    yaml_files.append(os.path.join(root, file))

        yaml_urls = [os.path.abspath(file) for file in yaml_files]

        return Response(
            response=self.__mergeYamlFiles(yaml_urls),
            status=200,
        )

    @staticmethod
    def __mergeYamlFiles(yaml_file_paths: list[str]) -> dict:
        """Merge multiple yaml files into a single dictionary"""

        merged_data = {
            'openapi': '3.0.0',
            'info': {
                'title': 'JTR API',
                'version': '1.0.0'
            },
            'paths': defaultdict(dict)
        }

        """Merge the paths from each file"""

        for file_path in yaml_file_paths:
            with open(file_path, 'r') as file:
                data = yaml.safe_load(file)

                for path, path_data in data.get('paths', {}).items():
                    if path in merged_data['paths']:

                        merged_data['paths'][path].update(path_data)

                    else:
                        merged_data['paths'][path] = path_data

        """Convert the default-dict to a regular dict"""

        merged_data['paths'] = dict(merged_data['paths'])

        return merged_data
