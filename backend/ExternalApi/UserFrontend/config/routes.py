from flask import Blueprint
from flask_jwt_extended import jwt_required

from config import cache, jwt_guest_required, limiter
from DataDomain.Model import Response
from ExternalApi.UserFrontend.config.extensions import create_user_cache_key
from ExternalApi.UserFrontend.Handler import (
    AuthenticateUserHandler,
    CreateNewPasswordHandler,
    CreatePasswordResetHandler,
    CreateUserHandler,
    DeleteUserHandler,
    GetUserDetailsHandler,
    IsAdminHandler,
    UpdateUserHandler,
    UpdateUserPictureHandler,
)
from ExternalApi.UserFrontend.InputFilter import (
    AuthenticateUserInputFilter,
    CreateNewPasswordInputFilter,
    CreatePasswordResetInputFilter,
    CreateUserInputFilter,
    GetUserDetailsInputFilter,
    IsAdminInputFilter,
    UpdateUserInputFilter,
    UpdateUserPictureInputFilter,
)

user_frontend = Blueprint('user-frontend', __name__)


@user_frontend.route('/get-user-details',
                     methods=['GET'], endpoint='get-user-details')
@user_frontend.route('/get-user-details/<escapedUsername>',
                     methods=['GET'], endpoint='get-user-details')
@cache.cached(key_prefix=create_user_cache_key)
@jwt_required(optional=True)
@GetUserDetailsInputFilter.validate()
def get_user_details(escapedUsername=None) -> Response:
    return GetUserDetailsHandler.handle()


@user_frontend.route('/is-admin/<userId>',
                     methods=['GET'], endpoint='is-admin')
@jwt_required()
@IsAdminInputFilter.validate()
def is_admin(user_id) -> Response:
    return IsAdminHandler.handle()


@user_frontend.route('/update-user',
                     methods=['PUT'], endpoint='update-user')
@limiter.limit('30 per day, 10 per hour, 3 per minute')
@jwt_required()
@UpdateUserInputFilter.validate()
def update_user() -> Response:
    return UpdateUserHandler.handle()


@user_frontend.route('/update-user-picture',
                     methods=['PUT'], endpoint='update-user-picture')
@limiter.limit('30 per day, 10 per hour, 3 per minute')
@jwt_required()
@UpdateUserPictureInputFilter.validate()
def update_user_picture() -> Response:
    return UpdateUserPictureHandler.handle()


@user_frontend.route('/authenticate-user', methods=['POST'], endpoint='authenticate-user')
@limiter.limit('60 per day, 20 per hour, 5 per minute')
@jwt_guest_required()
@AuthenticateUserInputFilter.validate()
def authenticate_user() -> Response:
    return AuthenticateUserHandler.handle()


@user_frontend.route('/create-user', methods=['POST'], endpoint='create-user')
@limiter.limit('15 per day, 7 per hour, 2 per minute')
@jwt_guest_required()
@CreateUserInputFilter.validate()
def create_user() -> Response:
    return CreateUserHandler.handle()


@user_frontend.route('/create-password-reset',
                     methods=['POST'],
                     endpoint='create-password-reset')
@limiter.limit('10 per day, 7 per hour, 2 per minute')
@jwt_guest_required()
@CreatePasswordResetInputFilter.validate()
def create_password_reset() -> Response:
    return CreatePasswordResetHandler.handle()


@user_frontend.route('/create-new-password',
                     methods=['PUT'],
                     endpoint='create-new-password')
@limiter.limit('30 per day, 10 per hour, 2 per minute')
@jwt_guest_required()
@CreateNewPasswordInputFilter.validate()
def create_new_password() -> Response:
    return CreateNewPasswordHandler.handle()


@user_frontend.route('/delete-user',
                     methods=['DELETE'],
                     endpoint='delete-user')
@limiter.limit('30 per day, 10 per hour, 2 per minute')
@jwt_required()
def delete_user() -> Response:
    return DeleteUserHandler.handle()
