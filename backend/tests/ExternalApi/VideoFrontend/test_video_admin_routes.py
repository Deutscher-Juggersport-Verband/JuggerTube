import json
from unittest.mock import MagicMock, patch

import pytest

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _json(response) -> dict:
    return json.loads(response.data)


def _make_video(video_id: int = 1, is_deleted: bool = False):
    """Return a MagicMock that looks like a Videos ORM instance."""
    video = MagicMock()
    video.id = video_id
    video.is_deleted = is_deleted

    def shadow():
        video.is_deleted = True

    video.shadow = shadow
    video.save = MagicMock()
    return video


# ---------------------------------------------------------------------------
# Shared request bodies
# ---------------------------------------------------------------------------

EDIT_BODY = {
    "videoId": 1,
    "name": "Updated Name",
}

DELETE_BODY = {
    "videoId": 1,
}


# ---------------------------------------------------------------------------
# Helper to post/put/delete with JSON
# ---------------------------------------------------------------------------

def _put(client, path, body, headers=None):
    return client.put(
        path,
        data=json.dumps(body),
        content_type="application/json",
        headers=headers or {},
    )


def _delete(client, path, body, headers=None):
    return client.delete(
        path,
        data=json.dumps(body),
        content_type="application/json",
        headers=headers or {},
    )


# ===========================================================================
# PUT /api/video-frontend/edit-video
# ===========================================================================

class TestEditVideoAuth:
    """Authorization checks for PUT /api/video-frontend/edit-video."""

    def test_no_token_returns_401(self, client):
        """Request without any Authorization header must be rejected with 401."""
        response = _put(client, "/api/video-frontend/edit-video", EDIT_BODY)
        assert response.status_code == 401

    def test_invalid_token_returns_422(self, client):
        """A malformed / expired token must be rejected with 422."""
        headers = {"Authorization": "Bearer this.is.not.a.valid.jwt"}
        response = _put(
            client, "/api/video-frontend/edit-video", EDIT_BODY, headers
        )
        assert response.status_code == 422

    def test_user_role_returns_403(
        self, client, user_auth_headers, patch_user_identity
    ):
        """A plain USER token must be rejected with 403."""
        response = _put(
            client, "/api/video-frontend/edit-video", EDIT_BODY, user_auth_headers
        )
        assert response.status_code == 403

    def test_moderator_role_returns_403(
        self, client, moderator_auth_headers, patch_moderator_identity
    ):
        """A MODERATOR token must be rejected with 403 (admin-only endpoint)."""
        response = _put(
            client,
            "/api/video-frontend/edit-video",
            EDIT_BODY,
            moderator_auth_headers,
        )
        assert response.status_code == 403

    def test_admin_role_passes_auth(
        self, client, admin_auth_headers, patch_admin_identity
    ):
        """An ADMIN token must pass the auth check (handler logic is mocked)."""
        mock_video = _make_video()

        with patch(
            "ExternalApi.VideoFrontend.Handler.EditVideoHandler.Videos"
        ) as MockVideos, patch(
            "ExternalApi.VideoFrontend.config.extensions.cache"
        ):
            MockVideos.query.get.return_value = mock_video

            response = _put(
                client,
                "/api/video-frontend/edit-video",
                EDIT_BODY,
                admin_auth_headers,
            )

        # Auth passed — handler ran and should return 200
        assert response.status_code == 200

    def test_error_message_present_on_403(
        self, client, user_auth_headers, patch_user_identity
    ):
        """403 response body must contain an 'error' key with a message."""
        response = _put(
            client, "/api/video-frontend/edit-video", EDIT_BODY, user_auth_headers
        )
        body = _json(response)
        assert "error" in body
        assert len(body["error"]) > 0


# ===========================================================================
# DELETE /api/video-frontend/delete-video
# ===========================================================================

class TestDeleteVideoAuth:
    """Authorization checks for DELETE /api/video-frontend/delete-video."""

    def test_no_token_returns_401(self, client):
        """Request without any Authorization header must be rejected with 401."""
        response = _delete(client, "/api/video-frontend/delete-video", DELETE_BODY)
        assert response.status_code == 401

    def test_invalid_token_returns_422(self, client):
        """A malformed / expired token must be rejected with 422."""
        headers = {"Authorization": "Bearer this.is.not.a.valid.jwt"}
        response = _delete(
            client, "/api/video-frontend/delete-video", DELETE_BODY, headers
        )
        assert response.status_code == 422

    def test_user_role_returns_403(
        self, client, user_auth_headers, patch_user_identity
    ):
        """A plain USER token must be rejected with 403."""
        response = _delete(
            client,
            "/api/video-frontend/delete-video",
            DELETE_BODY,
            user_auth_headers,
        )
        assert response.status_code == 403

    def test_moderator_role_returns_403(
        self, client, moderator_auth_headers, patch_moderator_identity
    ):
        """A MODERATOR token must be rejected with 403 (admin-only endpoint)."""
        response = _delete(
            client,
            "/api/video-frontend/delete-video",
            DELETE_BODY,
            moderator_auth_headers,
        )
        assert response.status_code == 403

    def test_admin_role_passes_auth(
        self, client, admin_auth_headers, patch_admin_identity
    ):
        """An ADMIN token must pass the auth check (handler logic is mocked)."""
        mock_video = _make_video()

        with patch(
            "ExternalApi.VideoFrontend.Handler.DeleteVideoHandler.Videos"
        ) as MockVideos, patch(
            "ExternalApi.VideoFrontend.config.extensions.cache"
        ):
            MockVideos.query.get.return_value = mock_video

            response = _delete(
                client,
                "/api/video-frontend/delete-video",
                DELETE_BODY,
                admin_auth_headers,
            )

        # Auth passed — handler ran and should return 200
        assert response.status_code == 200

    def test_error_message_present_on_403(
        self, client, user_auth_headers, patch_user_identity
    ):
        """403 response body must contain an 'error' key with a message."""
        response = _delete(
            client,
            "/api/video-frontend/delete-video",
            DELETE_BODY,
            user_auth_headers,
        )
        body = _json(response)
        assert "error" in body
        assert len(body["error"]) > 0


# ===========================================================================
# Handler behaviour (admin already authenticated)
# ===========================================================================

class TestEditVideoHandler:
    """Behaviour of EditVideoHandler when admin auth is satisfied."""

    @pytest.fixture(autouse=True)
    def _auth(self, patch_admin_identity):
        """All tests in this class run as ADMIN."""

    def test_returns_404_for_nonexistent_video(
        self, client, admin_auth_headers
    ):
        with patch(
            "ExternalApi.VideoFrontend.Handler.EditVideoHandler.Videos"
        ) as MockVideos:
            MockVideos.query.get.return_value = None
            response = _put(
                client,
                "/api/video-frontend/edit-video",
                EDIT_BODY,
                admin_auth_headers,
            )
        assert response.status_code == 404

    def test_returns_400_for_deleted_video(
        self, client, admin_auth_headers
    ):
        mock_video = _make_video(is_deleted=True)
        with patch(
            "ExternalApi.VideoFrontend.Handler.EditVideoHandler.Videos"
        ) as MockVideos:
            MockVideos.query.get.return_value = mock_video
            response = _put(
                client,
                "/api/video-frontend/edit-video",
                EDIT_BODY,
                admin_auth_headers,
            )
        assert response.status_code == 400

    def test_updates_provided_fields(self, client, admin_auth_headers):
        mock_video = _make_video()

        with patch(
            "ExternalApi.VideoFrontend.Handler.EditVideoHandler.Videos"
        ) as MockVideos, patch(
            "ExternalApi.VideoFrontend.config.extensions.cache"
        ):
            MockVideos.query.get.return_value = mock_video
            body = {"videoId": 1, "name": "New Name", "comment": "New comment"}
            response = _put(
                client,
                "/api/video-frontend/edit-video",
                body,
                admin_auth_headers,
            )

        assert response.status_code == 200
        assert mock_video.name == "New Name"
        assert mock_video.comment == "New comment"
        mock_video.save.assert_called_once()

    def test_missing_video_id_returns_400(self, client, admin_auth_headers):
        """InputFilter must reject a request body that omits the required videoId."""
        response = _put(
            client,
            "/api/video-frontend/edit-video",
            {"name": "No ID provided"},
            admin_auth_headers,
        )
        assert response.status_code == 400

    def test_returns_200_with_id_in_body(self, client, admin_auth_headers):
        mock_video = _make_video()

        with patch(
            "ExternalApi.VideoFrontend.Handler.EditVideoHandler.Videos"
        ) as MockVideos, patch(
            "ExternalApi.VideoFrontend.config.extensions.cache"
        ):
            MockVideos.query.get.return_value = mock_video
            response = _put(
                client,
                "/api/video-frontend/edit-video",
                EDIT_BODY,
                admin_auth_headers,
            )

        body = _json(response)
        assert body.get("id") == 1


class TestDeleteVideoHandler:
    """Behaviour of DeleteVideoHandler when admin auth is satisfied."""

    @pytest.fixture(autouse=True)
    def _auth(self, patch_admin_identity):
        """All tests in this class run as ADMIN."""

    def test_returns_404_for_nonexistent_video(
        self, client, admin_auth_headers
    ):
        with patch(
            "ExternalApi.VideoFrontend.Handler.DeleteVideoHandler.Videos"
        ) as MockVideos:
            MockVideos.query.get.return_value = None
            response = _delete(
                client,
                "/api/video-frontend/delete-video",
                DELETE_BODY,
                admin_auth_headers,
            )
        assert response.status_code == 404

    def test_returns_400_for_already_deleted_video(
        self, client, admin_auth_headers
    ):
        mock_video = _make_video(is_deleted=True)
        with patch(
            "ExternalApi.VideoFrontend.Handler.DeleteVideoHandler.Videos"
        ) as MockVideos:
            MockVideos.query.get.return_value = mock_video
            response = _delete(
                client,
                "/api/video-frontend/delete-video",
                DELETE_BODY,
                admin_auth_headers,
            )
        assert response.status_code == 400

    def test_soft_deletes_video(self, client, admin_auth_headers):
        mock_video = _make_video()

        with patch(
            "ExternalApi.VideoFrontend.Handler.DeleteVideoHandler.Videos"
        ) as MockVideos, patch(
            "ExternalApi.VideoFrontend.config.extensions.cache"
        ):
            MockVideos.query.get.return_value = mock_video
            response = _delete(
                client,
                "/api/video-frontend/delete-video",
                DELETE_BODY,
                admin_auth_headers,
            )

        assert response.status_code == 200
        # shadow() must have been called, flipping is_deleted
        assert mock_video.is_deleted is True

    def test_missing_video_id_returns_400(self, client, admin_auth_headers):
        """InputFilter must reject a request body that omits the required videoId."""
        response = _delete(
            client,
            "/api/video-frontend/delete-video",
            {},
            admin_auth_headers,
        )
        assert response.status_code == 400

    def test_returns_200_with_id_in_body(self, client, admin_auth_headers):
        mock_video = _make_video()

        with patch(
            "ExternalApi.VideoFrontend.Handler.DeleteVideoHandler.Videos"
        ) as MockVideos, patch(
            "ExternalApi.VideoFrontend.config.extensions.cache"
        ):
            MockVideos.query.get.return_value = mock_video
            response = _delete(
                client,
                "/api/video-frontend/delete-video",
                DELETE_BODY,
                admin_auth_headers,
            )

        body = _json(response)
        assert body.get("id") == 1
