<template>
  <transition name="right">
    <div class="card github-card" v-if="show">
      <div class="github-header"></div>
      <a :href="userUrl" class="user-link">
          <img :src="avatar" class="github-avatar">
      </a>
      <h1>{{ name }}</h1>
      <ul class="github-info">
          <li><a :href="repoUrl" target="_blank"><strong>{{ repoNum }}</strong>repos</a></li>
          <li><a :href="gistsUrl" target="_blank"><strong>{{ gistsNum }}</strong>gists</a></li>
          <li><a :href="followersUrl" target="_blank"><strong>{{ followersNum }}</strong>followers</a></li>
      </ul>
    </div>
  </transition>
</template>

<script>
const urlMap = {
  repoTab: '?tab=repositories',
  followersTab: '?tab=followers'
}

export default {
  name: "github-card",
  data() {
    return {
      show: false,
      name: "",
      userUrl: null,
      avatar: null,
      repoNum: null,
      repoUrl: null,
      followersNum: null,
      followersUrl: null,
      gistsNum: null,
      gistsUrl: null
    };
  },
  mounted() {
    if (!this.user) return;
    this.githubUserInfo(this.user).then(this.githubInfoHandle);
  },
  computed: {
    user() {
      const { themeConfig } = this.$site;
      return themeConfig.github
    }
  },
  methods: {
    githubUserInfo(user) {
      return fetch(`https://api.github.com/users/${user}`)
        .then(data => {
          this.show = true
          return data.text()
        })
        .then(text => JSON.parse(text));
    },
    githubInfoHandle(userInfo) {
      const {
        avatar_url,
        name,
        html_url,
        followers,
        public_gists,
        public_repos
      } = userInfo;
      this.avatar = avatar_url;
      this.name = name;
      this.userUrl = html_url;
      this.repoNum = public_repos;
      this.repoUrl = `${html_url}${urlMap.repoTab}`;
      this.followersNum = followers;
      this.followersUrl = `${html_url}${urlMap.followersTab}`;
      this.gistsNum = public_gists;
      this.gistsUrl = `https://gist.github.com/${this.user}`;
    }
  }
};
</script>

<style src="../styles/transition.styl" lang="stylus"></style>
<style src="../styles/card.styl" lang="stylus"></style>
<style lang="stylus">
@import '../styles/config.styl';

.github-card {
  text-align: center;
  max-width: $toolWidth;

  h1 {
    font-size: 24px;
    font-weight: 500;
    text-decoration: none;
  }
}

.github-header {
  height: 148px;
  position: relative;
  padding: 0;
  margin: 0;
  background: linear-gradient(to right, #EAECC6, #2BC0E4);
}

.link {
  color: #707070;
  text-decoration: none;
}

.user-link {
  display: inline-block;
  overflow: hidden;
  // https://gist.github.com/ayamflow/b602ab436ac9f05660d9c15190f4fd7b
  -webkit-mask-image: -webkit-radial-gradient(white, black); 
  background: #fff;
  border-radius: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  text-decoration: none;
  margin-top: -43px;
  border: 3px solid #fff;
  position: relative;
}

.github-avatar {
  display: block;
  width: 5rem;
  height: 5rem;
  transition: 0.2s ease-in-out;

  &:hover {
    transform: rotate(45deg);
  }
}

.github-info {
  font-size: 12px;
  color: #707070;
  list-style-type: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid #eee;
  zoom: 1;

  a {
    color: #707070;
  }

  strong {
    display: block;
    color: #292f33;
    font-size: 16px;
    line-height: 1.6;
  }

  li {
    width: 33.33%;
    float: left;
    font-size: 12px;
    padding: 8px 0;
    box-shadow: 1px 0 0 #eee;
  }
}
</style>