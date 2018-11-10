<template>
  <div :class="containerClass">
    <!-- 初始化 loading -->
    <div class="gt-initing" v-if="isIniting">
      <i class="gt-loader"/>
      <p class="gt-initing-text">{{i18n.t('init')}}</p>
    </div>
    <!-- meta -->
    <div class="gt-meta" key="meta" v-if="!isIniting && !isNoInit">
      <span class="gt-counts" v-html="countHtml()"></span>
      <!-- popup -->
      <div class="gt-popup" v-if="isPopupVisible">
        <Action
          v-if="user"
          @click="handleSort('first')"
          :class="ascClasses" 
          :text="i18n.t('sort-asc')"/>
        <Action
          v-if="user"
          @click="handleSort('last')"
          :class="descClasses" 
          :text="i18n.t('sort-desc')"/>
        <Action 
          v-if="user"
          class='gt-action-logout'
          @click="handleLogout"
          :text="i18n.t('logout')"/>
        <a v-else class="gt-action gt-action-login" @click="handleLogin">
          {{i18n.t('login-with-github')}}
        </a>
        <div class="gt-copyright">
          <a 
            class="gt-link gt-link-project" href="https://github.com/gitalk/gitalk" 
            target="_blank">
            Gitalk
          </a>
        </div>
      </div>
      <div class="gt-user">
        <div 
          v-if="user" 
          :class='userInnerClass' 
          @click.stop.prevent="handlePopup">
          <span class="gt-user-name">{{user.login}}</span>
          <SvgSpiner class="gt-ico-arrdown" name="arrow_down"/>
        </div>
        <div 
          v-else 
          :class='userInnerClass'
          @click.stop.prevent="handlePopup">
          <span class="gt-user-name">{{i18n.t('anonymous')}}</span>
          <SvgSpiner class="gt-ico-arrdown" name="arrow_down"/>
        </div>
      </div>
    </div>
    <!-- error msg -->
    <div class="gt-error" v-if="isOccurError">
      {{errorMsg}}
    </div>
    <!-- 初始化失败 -->
    <div class="gt-no-init" key="no-init" v-if="!isIniting && isNoInit">
      <p v-html="noInitHtml()"></p>
      <p v-html="concatAuthorHtml()"></p>
      <p v-if="isAdmin">
        <Button @click="handleIssueCreate" :isLoading="isIssueCreating">
            <span class="gt-btn-text">{{i18n.t('init-issue')}}</span>
        </Button>
      </p>
      <Button 
        v-if="!user"
        class="gt-btn-login" 
        @click="handleLogin">
        <span class="gt-btn-text">{{i18n.t('login-with-github')}}</span>
      </Button>
    </div>
    <!-- 初始化成功 -->
    <div v-else>
      <!-- header -->
      <div class="gt-header" key="header">
        <div v-if="user" class="gt-avatar gt-header-avatar">
          <img :src="user.avatar_url" alt="avatar">
        </div>
        <a v-else class="gt-avatar-github" @click="handleLogin">
          <SvgSpiner class="gt-ico-github" name="github"/>
        </a>
        <div class="gt-header-comment">
          <textarea
            ref="commentEL"
            :class="contentClasses"
            v-model="comment"
            @focus="handleCommentFocus"
            @blur="handleCommentBlur"
            @keydown.meta.enter="handleCommentKeyDown"
            @keydown.ctrl.enter="handleCommentKeyDown"
            :placeholder="i18n.t('leave-a-comment')"
          />
          <div :class="previewClasses" v-html="previewHtml" />
          <!-- comment action area -->
          <div class="gt-header-controls">
            <a 
              class="gt-header-controls-tip" 
              href="https://guides.github.com/features/mastering-markdown/" 
              target="_blank">
              <SvgSpiner 
                class="gt-ico-tip" 
                name="tip" 
                :text="i18n.t('support-markdown')"/>
            </a>
            <Button
              v-if="user"
              class="gt-btn-public"
              @click="handleCommentCreate"
              :isLoading="isCreating">
                <span class="gt-btn-text">{{i18n.t('comment')}}</span>
            </Button>
            <Button
              class="gt-btn-preview"
              @click="handleCommentPreview">
              <span class="gt-btn-text">{{editOrPreview}}</span>
            </Button>
            <Button 
              v-if="!user"
              class="gt-btn-login" 
              @click="handleLogin">
              <span class="gt-btn-text">{{i18n.t('login-with-github')}}</span>    
            </Button>
          </div>
        </div>
      </div>
      <!-- comments list -->
      <div class="gt-comments" key="comments">
        <transition-group name="flip-list">
          <Comment 
            v-for="c in totalComments" 
            :comment="c"
            :key="c.id"
            :user="user"
            :language="options.language"
            :commentedText="i18n.t('commented')"
            :admin="options.admin"
            @like="like"
            @unlike="unLike"
            @reply="reply" />
        </transition-group>
          
        <p v-if="!totalComments.length" class="gt-comments-null">
            {{i18n.t('first-comment-person')}}
        </p>
        <div 
          v-if="!isLoadOver && totalComments.length" 
          class="gt-comments-controls">
          <Button 
            class="gt-btn-loadmore" 
            @click="handleCommentLoad" 
            :isLoading="isLoadMore">
            <span class="gt-btn-text">{{i18n.t('load-more')}}</span>    
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mixin from './mixin';
import { GT_COMMENT, GT_ACCESS_TOKEN } from './const';
import {
  queryParse,
  queryStringify,
  axiosJSON,
  axiosGithub,
  getMetaContent,
  formatErrorMsg,
  hasClassInParent
} from './util';

import Svg from './components/Svg';
import Button from './components/Button';
import Action from './components/Action';
import Comment from './components/Comment';

export default {
  mixins: [Mixin],
  components: {
    SvgSpiner: Svg,
    Button,
    Comment,
    Action
  },
  computed: {
    isDesc() {
      return this.pagerDirection === 'last';
    },
    totalComments() {
      const c = this.comments.concat([]);
      if (this.isDesc && this.accessToken) {
        c.reverse();
      }
      return c;
    },
    storedComment() {
      return localStorage.getItem(GT_COMMENT);
    },
    editOrPreview() {
      return this.isPreview ? this.i18n.t('edit') : this.i18n.t('preview');
    },
    containerClass() {
      return [
        'gt-container',
        {
          'gt-input-focused': this.isInputFocused
        }
      ];
    },
    contentClasses() {
      return [
        'gt-header-textarea',
        {
          hide: this.isPreview
        }
      ];
    },
    previewClasses() {
      return [
        'gt-header-preview',
        'markdown-body',
        {
          hide: !this.isPreview
        }
      ];
    },
    descClasses() {
      return [
        'gt-action',
        'gt-action-sortdesc',
        {
          'is--active': this.isDesc
        }
      ];
    },
    ascClasses() {
      return [
        'gt-action',
        'gt-action-sortasc',
        {
          'is--active': !this.isDesc
        }
      ];
    },
    userInnerClass() {
      return [
        'gt-user-inner',
        {
          'is--poping': this.isPopupVisible
        }
      ];
    }
  },
  methods: {
    countHtml() {
      return this.i18n.t('counts', {
        counts: `<a class="gt-link gt-link-counts" href="${this.issue &&
          this.issue.html_url}" target="_blank">${this.count()}</a>`,
        smart_count: this.count()
      });
    },
    noInitHtml() {
      const { owner, repo } = this.options;

      return this.i18n.t('no-found-related', {
        link: `<a href="https://github.com/${owner}/${repo}/issues">Issues</a>`
      });
    },
    concatAuthorHtml() {
      const { owner, repo, admin } = this.options;
      return this.i18n.t('please-contact', {
        user: []
          .concat(admin)
          .map(u => `@${u}`)
          .join(' ')
      });
    },
    count() {
      const {
        user,
        issue,
        isPopupVisible,
        pagerDirection,
        localComments
      } = this;
      const cnt = (issue && issue.comments) + localComments.length;
      const isDesc = pagerDirection === 'last';
      const { updateCountCallback } = this.options;

      if (
        updateCountCallback &&
        Object.toString.call(updateCountCallback) === '[object Function]'
      ) {
        try {
          updateCountCallback(cnt);
        } catch (err) {
          console.log(
            'An error occurred executing the updateCountCallback:',
            err
          );
        }
      }

      return cnt;
    }
  }
};
</script>

<style lang="stylus" src="./index.styl"></style>
<style lang="stylus">
.flip-list-move {
  transition: transform 1s;
}
</style>

