from unittest.mock import MagicMock, patch

import pytest
from flask_jwt_extended import create_access_token

from config.app import create_app
from DataDomain.Database import db as _db
from DataDomain.Database.Enum import UserRoleEnum


@pytest.fixture(scope="session")
def app():
    """Create a Flask app configured for testing with an in-memory SQLite DB."""
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
        JWT_SECRET_KEY="test-jwt-secret-key",
        CACHE_TYPE="null",
        WTF_CSRF_ENABLED=False,
        # Disable Talisman security headers in tests
        TALISMAN_FORCE_HTTPS=False,
    )
    return app


@pytest.fixture(scope="session")
def db(app):
    """Create all tables once for the test session, then drop them."""
    with app.app_context():
        _db.create_all()
        yield _db
        _db.drop_all()


@pytest.fixture()
def client(app, db):
    """A test client for making HTTP requests."""
    with app.test_client() as client:
        with app.app_context():
            yield client


# ---------------------------------------------------------------------------
# JWT token helpers
# ---------------------------------------------------------------------------

def _make_token(app, user_id: int, role: UserRoleEnum) -> str:
    """Mint a JWT for a fake user with the given role."""
    with app.app_context():
        return create_access_token(identity=str(user_id))


def _mock_user(role: UserRoleEnum):
    """Return a MagicMock that looks like a Users ORM object with the given role."""
    user = MagicMock()
    user.id = 1
    user.role = role
    return user


@pytest.fixture()
def admin_auth_headers(app):
    """Authorization headers carrying an ADMIN JWT."""
    token = _make_token(app, user_id=1, role=UserRoleEnum.ADMIN)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def moderator_auth_headers(app):
    """Authorization headers carrying a MODERATOR JWT."""
    token = _make_token(app, user_id=2, role=UserRoleEnum.MODERATOR)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def user_auth_headers(app):
    """Authorization headers carrying a plain USER JWT."""
    token = _make_token(app, user_id=3, role=UserRoleEnum.USER)
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# Patches applied to every test automatically
# ---------------------------------------------------------------------------

@pytest.fixture(autouse=True)
def patch_get_jwt_identity(request):
    """
    By default patch getJwtIdentity() to return None (unauthenticated).
    Individual tests can override this by calling the patch themselves.
    Tests that provide auth headers will override this via the role-specific
    fixture helpers below.
    """
    # Skip the auto-patch if the test explicitly requests a role fixture so
    # that the role fixtures can set up their own patch.
    requesting = request.fixturenames
    if any(f in requesting for f in (
        "patch_admin_identity",
        "patch_moderator_identity",
        "patch_user_identity",
    )):
        yield
        return

    with patch(
        "BusinessDomain.User.Rule.IsCurrentUserAdminRule.getJwtIdentity",
        return_value=None,
    ), patch(
        "BusinessDomain.User.Rule.IsCurrentUserPrivilegedRule.getJwtIdentity",
        return_value=None,
    ):
        yield


@pytest.fixture()
def patch_admin_identity():
    """Patch getJwtIdentity to return an ADMIN user."""
    mock = _mock_user(UserRoleEnum.ADMIN)
    with patch(
        "BusinessDomain.User.Rule.IsCurrentUserAdminRule.getJwtIdentity",
        return_value=mock,
    ), patch(
        "BusinessDomain.User.Rule.IsCurrentUserPrivilegedRule.getJwtIdentity",
        return_value=mock,
    ):
        yield


@pytest.fixture()
def patch_moderator_identity():
    """Patch getJwtIdentity to return a MODERATOR user."""
    mock = _mock_user(UserRoleEnum.MODERATOR)
    with patch(
        "BusinessDomain.User.Rule.IsCurrentUserAdminRule.getJwtIdentity",
        return_value=mock,
    ), patch(
        "BusinessDomain.User.Rule.IsCurrentUserPrivilegedRule.getJwtIdentity",
        return_value=mock,
    ):
        yield


@pytest.fixture()
def patch_user_identity():
    """Patch getJwtIdentity to return a plain USER."""
    mock = _mock_user(UserRoleEnum.USER)
    with patch(
        "BusinessDomain.User.Rule.IsCurrentUserAdminRule.getJwtIdentity",
        return_value=mock,
    ), patch(
        "BusinessDomain.User.Rule.IsCurrentUserPrivilegedRule.getJwtIdentity",
        return_value=mock,
    ):
        yield
