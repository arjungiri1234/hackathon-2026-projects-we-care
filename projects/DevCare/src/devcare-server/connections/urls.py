from django.urls import path
from .views import CreateJoinLinkView, JoinLinkView

urlpatterns = [
    path("create-join-link/", CreateJoinLinkView.as_view(), name="create-join-link"),
    path("join/<str:token>/", JoinLinkView.as_view(), name="join-link"),
]
