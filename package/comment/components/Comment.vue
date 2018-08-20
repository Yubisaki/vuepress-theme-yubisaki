<template>
    <div :class="commentClass">
        <!-- avatar -->
        <div class="gt-avatar gt-comment-avatar">
            <img :src="avatarUrl" alt="avatar">
        </div>
        <!-- comment content -->
        <div class="gt-comment-content">
            <div class="gt-comment-header">
                <a
                    class="gt-comment-username"
                    :href="userInfoUrl">
                    {{userName}}
                </a>
                <span class="gt-comment-text">
                    {{commentedText}}
                </span>
                <!-- date -->
                <span class="gt-comment-date">
                    {{commentDate}}
                </span>
                <!-- comment like -->
                <a class="gt-comment-like" @click="likeAction" v-if="reactions">
                    <SvgSpinner
                        v-if="reactions.viewerHasReacted"
                        class="gt-ico-heart" 
                        name="heart_on" 
                        :text="reactionCount" />
                    <SvgSpinner
                        v-else
                        class="gt-ico-heart" 
                        name="heart" 
                        :text="reactionCount"/>
                </a>
                <!-- edit -->
                <a 
                    v-if="enableEdit"
                    :href="comment.html_url" 
                    class="gt-comment-edit" 
                    target="_blank">
                    <SvgSpinner class="gt-ico-edit" name="edit"/>
                </a>
                <a 
                    v-else
                    class="gt-comment-reply" 
                    @click="reply">
                    <SvgSpinner class="gt-ico-reply" name="reply"/>
                </a>
            </div>
            <div 
                class="gt-comment-body markdown-body" 
                v-html="comment.body_html"></div>
        </div>
    </div>
</template>

<script>
import Svg from "./Svg";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import buildDistanceInWordsLocaleZHCN from "date-fns/locale/zh_cn/build_distance_in_words_locale/index";
import "github-markdown-css/github-markdown.css";

const ZHCN = buildDistanceInWordsLocaleZHCN();

export default {
    components: {
        SvgSpinner: Svg
    },
    props: {
        user: {
            default: null
        },
        comment: {
            default: null
        },
        language: {
            default: "en"
        },
        commentedText: {
            default: ""
        },
        admin: {
            default: () => []
        }
    },
    computed: {
        enableEdit() {
            if (this.user) {
                return this.comment.user.login === this.user.login;
            }
            return false;
        },
        avatarUrl() {
            if (this.comment.user) {
                return this.comment.user.avatar_url;
            }
            return null;
        },
        userInfoUrl() {
            if (this.comment.user) {
                return this.comment.user.html_url;
            }
            return null;
        },
        userName() {
            if (this.comment.user) {
                return this.comment.user.login;
            }
            return "";
        },
        commentDate() {
            distanceInWordsToNow(this.comment.created_at, {
                addSuffix: true,
                locale: {
                    distanceInWords: ZHCN
                }
            });
        },
        reactions() {
            return this.comment.reactions;
        },
        reactionCount() {
            let count = 0;
            const reactions = this.reactions;
            if (reactions && reactions.totalCount) {
                count = reactions.totalCount;
                if (
                    reactions.totalCount === 100 &&
                    reactions.pageInfo &&
                    reactions.pageInfo.hasNextPage
                ) {
                    count = "100+";
                }
            }
            return count;
        },
        isAdmin() {
            return ~[]
                .concat(this.admin)
                .map(a => a.toLowerCase())
                .indexOf(this.comment.user.login.toLowerCase());
        },
        commentClass() {
            return [
                "gt-comment",
                {
                    "gt-comment-admin": this.isAdmin
                }
            ];
        }
    },
    methods: {
        reply() {
            this.$emit('reply', this.comment)
        },
        likeAction() {
            if (this.reactions && this.reactions.viewerHasReacted) {
                this.$emit('unlike', this.comment)
            } else {
                this.$emit('like', this.comment)
            }
        }
    }
};
</script>
