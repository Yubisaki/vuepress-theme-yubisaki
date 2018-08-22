import {
    queryStringify,
    axiosJSON,
    axiosGithub,
    getMetaContent,
    formatErrorMsg,
    hasClassInParent
} from "../util";
import i18n from '../i18n'
import autosize from "autosize";
import { GT_ACCESS_TOKEN, GT_COMMENT } from "../const";
import QLGetComments from "../graphql/getComments";

const Mixin = {
    data() {
        return {
            user: null,
            issue: null,
            comments: [],
            localComments: [],
            comment: "",
            page: 1,
            pagerDirection: "last",
            cursor: null,
            previewHtml: "",

            isNoInit: false,
            isIniting: true,
            isCreating: false,
            isLoading: false,
            isLoadMore: false,
            isLoadOver: false,
            isIssueCreating: false,
            isPopupVisible: false,
            isInputFocused: false,
            isPreview: false,

            isOccurError: false,
            errorMsg: "",

            _accessToken: null,
            options: {},
            i18n: i18n('en'),
            commentEL: null
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.commentEL = this.$refs['commentEL'];

            if (this.storedComment) {
                this.comment = decodeURIComponent(this.storedComment);
                localStorage.removeItem(GT_COMMENT);
            }
            
            this.options = Object.assign(
                this.options,
                {
                    id: document.title,
                    number: -1,
                    labels: ["Gitalk"],
                    title: document.title,
                    body: "", // location.href + header.meta[description]
                    language: navigator.language || navigator.userLanguage,
                    perPage: 10,
                    pagerDirection: "last", // last or first
                    createIssueManually: false,
                    distractionFreeMode: false,
                    proxy:
                        "https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token",
                    enableHotKey: true,
                    url: location.href,
                    defaultAuthor: {
                        avatarUrl:
                            "//avatars1.githubusercontent.com/u/29697133?s=50",
                        login: "null",
                        url: ""
                    },
                    updateCountCallback: null
                },
                this.$site.themeConfig.comment
            );

            this.i18n = i18n(this.options.language);

            this.initial();
        });
    },
    computed: {
        isAdmin() {
            const { admin } = this.options;
            return (
                this.user &&
                ~[]
                    .concat(admin)
                    .map(a => a.toLowerCase())
                    .indexOf(this.user.login.toLowerCase())
            );
        },
        accessToken: {
            get: function() {
                if (typeof window === 'undefined') {
                    return this._accessToken;
                }
                return this._accessToken || localStorage.getItem(GT_ACCESS_TOKEN);
            },
            set: function(token) {
                this._accessToken = token;
                if (typeof window !== 'undefined') {
                    localStorage.setItem(GT_ACCESS_TOKEN, token);
                }
            }
        },
        loginLink() {
            const githubOauthUrl = "http://github.com/login/oauth/authorize";
            const { clientID } = this.options;
            const query = {
                client_id: clientID,
                redirect_uri: location.href,
                scope: "public_repo"
            };
            return `${githubOauthUrl}?${queryStringify(query)}`;
        }
    },
    methods: {
        initial() {
            const query = this.$route.query;
            if (query.code) {
                const code = query.code;
                delete this.$route.query.code;
                const replacedUrl = `${location.origin}${
                    location.pathname
                }${queryStringify(query)}${location.hash}`;
                history.replaceState(null, null, replacedUrl);
                this.options = Object.assign(
                    {},
                    this.options,
                    {
                        url: replacedUrl,
                        id: replacedUrl
                    },
                    this.$site.themeConfig.comment
                );
                this.commentInital(code);
            } else {
                this.getInit()
                    .then(() => {
                        this.isIniting = false;
                    })
                    .catch(err => {
                        console.log("err:", err);
                        this.isIniting = false;
                        this.isOccurError = true;
                        this.errorMsg = formatErrorMsg(err);
                    });
            }
        },
        commentInital(code) {
            axiosJSON.post(this.options.proxy, {
                code,
                client_id: this.options.clientID,
                client_secret: this.options.clientSecret
            }).then(res => {
                if (res.data && res.data.access_token) {
                    this.accessToken = res.data.access_token
        
                    this.getInit()
                        .then(() => {
                            this.isIniting = false;
                        })
                        .catch(err => {
                            console.log('init err:', err);
                            this.isIniting = false;
                            this.isOccurError = true;
                            this.errorMsg = formatErrorMsg(err);
                        })
                } else {
                  // no access_token
                  console.log('res.data err:', res.data)
                  this.isOccurError = true;
                  this.errorMsg = formatErrorMsg(new Error('no access token'));
                }
            }).catch(err => {
                console.log('err: ', err)
                this.isOccurError = true;
                this.errorMsg = formatErrorMsg(err)
            })
        },
        getInit() {
            return this.getUserInfo()
                .then(() => this.getIssue())
                .then(issue => this.getComments(issue));
        },
        getIssue() {
            const { number } = this.options;
            if (this.issue) {
                this.isNoInit = false;
                return Promise.resolve(this.issue);
            }

            if (typeof number === "number" && number > 0) {
                return this.getIssueById().then(resIssue => {
                    if (!resIssue) return this.getIssueByLabels();
                    return resIssue;
                });
            }
            return this.getIssueByLabels();
        },
        getIssueById() {
            const {
                owner,
                repo,
                number,
                clientID,
                clientSecret
            } = this.options;
            const getUrl = `/repos/${owner}/${repo}/issues/${number}`;

            return new Promise((resolve, reject) => {
                axiosGithub
                    .get(getUrl, {
                        params: {
                            client_id: clientID,
                            client_secret: clientSecret,
                            t: Date.now()
                        }
                    })
                    .then(res => {
                        let issue = null;

                        if (res && res.data && res.data.number === number) {
                            issue = res.data;

                            this.issue = issue;
                            this.isNoInit = false;
                        }
                        resolve(issue);
                    })
                    .catch(err => {
                        // When the status code is 404, promise will be resolved with null
                        if (err.response.status === 404) resolve(null);
                        reject(err);
                    });
            });
        },
        getIssueByLabels() {
            const {
                owner,
                repo,
                id,
                labels,
                clientID,
                clientSecret
            } = this.options;

            return axiosGithub
                .get(`/repos/${owner}/${repo}/issues`, {
                    params: {
                        client_id: clientID,
                        client_secret: clientSecret,
                        labels: labels.concat(id).join(","),
                        t: Date.now()
                    }
                })
                .then(res => {
                    const { createIssueManually } = this.options;
                    let isNoInit = false;
                    let issue = null;
                    if (!(res && res.data && res.data.length)) {
                        if (!createIssueManually && this.isAdmin) {
                            return this.createIssue();
                        }

                        isNoInit = true;
                    } else {
                        issue = res.data[0];
                    }
                    this.issue = issue;
                    this.isNoInit = isNoInit;
                    return issue;
                });
        },
        createIssue() {
            const { owner, repo, title, body, id, labels, url } = this.options;
            return axiosGithub
                .post(
                    `/repos/${owner}/${repo}/issues`,
                    {
                        title,
                        labels: labels.concat(id),
                        body: body || `${url} \n\n ${
                            getMetaContent('description') ||
                            getMetaContent('description', 'og:description') || ''
                        }`
                    },
                    {
                        headers: {
                            Authorization: `token ${this.accessToken}`
                        }
                    }
                )
                .then(res => {
                    this.issue = res.data;
                    return res.data;
                });
        },
        getComments(issue) {
            if (!issue) return;
            // Get comments via v4 graphql api, login required and sorting feature is available
            if (this.accessToken) return QLGetComments.call(this, issue);
            return this.getCommentsV3(issue);
        },
        createComment() {
            return this.getIssue()
                .then(issue =>
                    axiosGithub.post(
                        issue.comments_url,
                        {
                            body: this.comment
                        },
                        {
                            headers: {
                                Accept: "application/vnd.github.v3.full+json",
                                Authorization: `token ${this.accessToken}`
                            }
                        }
                    )
                )
                .then(res => {
                    this.comment = ""
                    this.comments = this.comments.concat(res.data)
                    this.localComments = this.localComments.concat(res.data)
                });
        },
        getCommentsV3(issue) {
            const { clientID, clientSecret, perPage } = this.options;
            return this.getIssue().then(issue => {
                if (!issue) return;

                return axiosGithub
                    .get(issue.comments_url, {
                        headers: {
                            Accept: "application/vnd.github.v3.full+json"
                        },
                        params: {
                            client_id: clientID,
                            client_secret: clientSecret,
                            per_page: perPage,
                            page: this.page
                        }
                    })
                    .then(res => {
                        let isLoadOver = false;
                        const cs = this.comments.concat(res.data);
                        if (
                            cs.length >= this.issue.comments ||
                            res.data.length < perPage
                        ) {
                            isLoadOver = true;
                        }
                        this.comments = cs;
                        this.isLoadOver = isLoadOver;
                        this.page = this.page + 1;

                        return cs;
                    });
            });
        },
        reply(replyComment) {
            const comment = this.comment;
            const replyCommentBody = replyComment.body;
            let replyCommentArray = replyCommentBody.split("\n");
            replyCommentArray.unshift(`@${replyComment.user.login}`);
            replyCommentArray = replyCommentArray.map(t => `> ${t}`);
            replyCommentArray.push("");
            replyCommentArray.push("");
            if (comment) replyCommentArray.unshift("");
            this.comment = comment + replyCommentArray.join("\n");
            autosize.update(this.commentEL);
            this.commentEL.focus();
        },
        like(comment) {
            const { owner, repo } = this.options;
            let comments = this.comments;
            let user = this.user;

            axiosGithub
                .post(
                    `/repos/${owner}/${repo}/issues/comments/${
                        comment.id
                    }/reactions`,
                    {
                        content: "heart"
                    },
                    {
                        headers: {
                            Authorization: `token ${this.accessToken}`,
                            Accept:
                                "application/vnd.github.squirrel-girl-preview"
                        }
                    }
                )
                .then(res => {
                    comments = comments.map(c => {
                        if (c.id === comment.id) {
                            if (c.reactions) {
                                if (
                                    !~c.reactions.nodes.findIndex(
                                        n => n.user.login === user.login
                                    )
                                ) {
                                    c.reactions.totalCount += 1;
                                }
                            } else {
                                c.reactions = { nodes: [] };
                                c.reactions.totalCount = 1;
                            }

                            c.reactions.nodes.push(res.data);
                            c.reactions.viewerHasReacted = true;
                        }
                        return c;
                    });

                    this.comments = comments;
                });
        },
        unLike(comment) {
            let comments = this.comments;
            let user = this.user;

            const getQL = id => {
                return {
                    operationName: "RemoveReaction",
                    query: `
                  mutation RemoveReaction{
                    removeReaction (input:{
                      subjectId: "${id}",
                      content: HEART
                    }) {
                      reaction {
                        content
                      }
                    }
                  }
                `
                };
            };

            axiosGithub
                .post("/graphql", getQL(comment.gId), {
                    headers: {
                        Authorization: `bearer ${this.accessToken}`
                    }
                })
                .then(res => {
                    if (res.data) {
                        comments = comments.map(c => {
                            if (c.id === comment.id) {
                                const index = c.reactions.nodes.findIndex(
                                    n => n.user.login === user.login
                                );
                                if (~index) {
                                    c.reactions.totalCount -= 1;
                                    c.reactions.nodes.splice(index, 1);
                                }
                                c.reactions.viewerHasReacted = false;
                            }
                            return c;
                        });

                        this.comments = comments;
                    }
                });
        },
        handleLogin() {
            localStorage.setItem(GT_COMMENT, encodeURIComponent(this.comment))
            location.href = this.loginLink;
        },
        handleIssueCreate() {
            this.isIssueCreating = true;
            this.createIssue().then(issue => {
                this.isIssueCreating = false;
                this.isOccurError = false;
                return this.getComments(issue);
            }).catch(err => {
                this.isIssueCreating = false;
                this.isOccurError = true;
                this.errorMsg = formatErrorMsg(err)
            })
        },
        handleCommentCreate(e) {
            if (!this.comment.length) {
                e && e.preventDefault();
                this.commentEL.focus()
                return
            }
            this.isCreating = true;
            this.createComment()
                .then(() => {
                    this.isCreating = false
                    this.isOccurError = false
                })
                .catch(err => {
                    this.isCreating = false
                    this.isOccurError = true
                    this.errorMsg = formatErrorMsg(err)
                })
        },
        handleCommentPreview() {
            this.isPreview = !this.isPreview;
        
            axiosGithub.post('/markdown', {
              text: this.comment
            }, {
              headers: this.accessToken && { Authorization: `token ${this.accessToken}` }
            }).then(res => {
                this.previewHtml = res.data;
            }).catch(err => {
                this.isOccurError = true;
                this.errorMsg = formatErrorMsg(err);
            })
        },
        handleCommentLoad() {
            if (this.isLoadMore) return
            this.isLoadMore = true;
            this.getComments(this.issue)
                .then(() => {
                    this.isLoadMore = false;
                })
        },
        handleLogout() {
            this.logout();
            location.reload();
        },
        handleCommentFocus(e) {
            const { distractionFreeMode } = this.options
            if (!distractionFreeMode) return e && e.preventDefault()
            this.isInputFocused = true;
        },
        handleCommentBlur(e) {
            const { distractionFreeMode } = this.options
            if (!distractionFreeMode) return e && e.preventDefault()
            this.isInputFocused = false;
        },
        handleSort(direction) {
            this.pagerDirection = direction;
        },
        handlePopup() {
            const isVisible = !this.isPopupVisible
            const hideHandle = e => {
              if (hasClassInParent(e.target, 'gt-user', 'gt-popup')) {
                return
              }
              document.removeEventListener('click', hideHandle)
              this.isPopupVisible = false;
            }
            this.isPopupVisible = isVisible;
            if (isVisible) {
              document.addEventListener('click', hideHandle)
            } else {
              document.removeEventListener('click', hideHandle)
            }
        },
        handleCommentKeyDown() {
            const { enableHotKey } = this.options
            if (enableHotKey) {
            //   this.publicBtnEL && this.publicBtnEL.focus()
              this.handleCommentCreate();
            }
        },
        getUserInfo() {
            const accessToken = 
                this._accessToken || 
                localStorage.getItem(GT_ACCESS_TOKEN);

            return axiosGithub
                .get("/user", {
                    headers: {
                        Authorization: `token ${accessToken}`
                    }
                })
                .then(res => {
                    this.user = res.data;
                })
                .catch(err => {
                    this.logout();
                });
        },
        logout() {
            this.user = null;
            localStorage.removeItem(GT_ACCESS_TOKEN);
        }
    }
};

export default Mixin;
