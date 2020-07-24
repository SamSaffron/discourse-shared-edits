# frozen_string_literal: true

module ::DiscourseSharedEdits
  class RevisionController < ::ApplicationController
    requires_login
    before_action :ensure_logged_in
    skip_before_action :preload_json, :check_xhr

    def enable
      guardian.ensure_can_toggle_shared_edits!
      SharedEditRevision.toggle_shared_edits!(params[:post_id].to_i, true)
      render json: success_json
    end

    def disable
      guardian.ensure_can_toggle_shared_edits!
      SharedEditRevision.toggle_shared_edits!(params[:post_id].to_i, false)
      render json: success_json
    end

    def latest
      post = Post.find(params[:post_id].to_i)
      guardian.ensure_can_see!(post)
      version, raw = SharedEditRevision.latest_raw(post)
      render json: {
        raw: raw,
        version: version
      }
    end

    def revise
      params.require(:revision)
      params.require(:client_id)
      params.require(:version)

      master_version = params[:version].to_i

      post = Post.find(params[:post_id].to_i)
      guardian.ensure_can_see!(post)

      version, revision = SharedEditRevision.revise!(
        post_id: post.id,
        user_id: current_user.id,
        client_id: params[:client_id],
        version: master_version,
        revision: params[:revision]
      )

      revisions =
        if version == master_version + 1
          {
            version: version,
            revision: revision
          }
        else
          SharedEditRevision
            .where(post_id: post.id)
            .where('version > ?', master_version)
            .order(:version)
            .pluck(:revision, :version).map { |r, v| { version: v, revision: r } }
        end

      SharedEditRevision.ensure_will_commit(post.id)

      render json: {
        version: version,
        revisions: revisions
      }
    end

  end
end
