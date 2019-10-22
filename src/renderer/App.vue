<template>
  <div id="app">
    <div class="title-bar">
      <div id="logo">App Shell</div>

      <div id="dragable"></div>

      <div class="window-controls-container">
        <div class="window-icon-bg">
          <button class="window-action window-minimize" @click="minimize"></button>
        </div>

        <div class="window-icon-bg">
          <button class="window-action window-max-restore" :class="maxRestoreClass" @click="toggleMaximize"></button>
        </div>

        <div class="window-icon-bg window-close-bg">
          <button class="window-action window-close" @click="close"></button>
        </div>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'proto',
    data(){
      return {
        w: require('electron').remote.getCurrentWindow(),        
        maxRestoreClass: null
      }
    },
    created() {
      this.maxRestoreClass = this.w.isMaximized() ? 'window-unmaximize': 'window-maximize'

      this.w.addListener('maximize', () => {
        this.maxRestoreClass = 'window-unmaximize'
      })
      this.w.addListener('unmaximize', () => {
        this.maxRestoreClass = 'window-maximize'
      })
    },
    methods: {
      close() {
        this.w.close()
      },
      toggleMaximize() {
        if ( this.maxRestoreClass == 'window-maximize' ) 
          this.w.maximize()
        else 
          this.w.unmaximize()          
      },
      minimize() {
        this.w.minimize()
      },
    }
  }
</script>

<style lang="scss">
  .title-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: var(--title-bar-size);
    background-color: var(--title-bar-color);
    overflow: hidden;

    #logo {
      padding: .0 .5rem;
      cursor: default;
      -webkit-user-select: none;
      -webkit-app-region: drag;
    }
    
    #dragable {
      flex: 1;
      height: 100%;
      -webkit-user-select: none;
      -webkit-app-region: drag;
    }

    .window-controls-container {
      display: flex;

      .window-action {
        border: 0;
        height: 1.5rem;
        width: 2.5rem;

        &.window-minimize {
          -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
        }

        &.window-maximize {
          -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
        }

        &.window-unmaximize {
          -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
        }

        &.window-close {
          -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
        }
      }
      
      .window-icon-bg:hover {
        background-color: silver;
      }
      
      .window-close-bg:hover {
        background-color: red;
      }
    }
  }
</style>