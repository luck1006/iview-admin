<template>
    <Row type="flex" justify="start" align="bottom" class="code-row-bg">
      <i-col span="4">
        <div>团队(必选)</div>
        <Select v-model="team" @on-change="selectteam(team)" clearable>
          <Option v-for="(teamitem,index) in teamlist" :value="teamitem" :key="index">
            {{ teamitem }}
          </Option>
        </Select>
      </i-col>
      <i-col span="4">
        <div>项目(必选)</div>
        <Select v-model="project" @on-change="selectproject(project)" clearable>
          <Option v-for="(projectitem,index) in projectlist" :value="projectitem" :key="index">
            {{ projectitem }}
          </Option>
        </Select>
      </i-col>
      <i-col span="4">
        <div>版本(必选)</div>
        <Select v-model="version" @on-change="selectversion(version)" clearable>
          <Option v-for="(versionitem,index) in versionlist" :value="versionitem" :key="index">
            {{ versionitem }}
          </Option>
        </Select>
      </i-col>
      <i-col span="4">
        <Button type="primary" id="search" @click="SearchInfo()">Search</Button>
      </i-col>
    </Row>
</template>
<script>
import { searchreqinfo, getreqteaminfo } from '@/api/data'
import Loading from '@/components/loading'
export default {
  data () {
    return {
      isLoading: true,
      team: '',
      project: '',
      version: '',
      reqdatalist: [],
      teamlist: [],
      projectlist: [],
      versionlist: [],
      reqtotal: 0,
      reqdeplaytotal: 0,
      reqinserttotal: 0,
      reqownerdata: [],
      self: this
    }
  },
  components: {
    Loading
  },
  created () {

  },
  mounted () {
    // 获取需求团队版本各项信息
    this.getteaminfo()
  },
  methods: {
    getteaminfo: function () {
      getreqteaminfo().then(res => {
        if (res.data && res.data.data) {
          this.reqdatalist = res.data.data
          // console.log(this.reqdatalist)
          for (const item of this.reqdatalist) {
            if (item.req_team && item.req_project && item.req_version) {
              this.teamlist.push(item.req_team)
              this.projectlist.push(item.req_project)
              this.versionlist.push(item.req_version)
            }
          }
          for (var i = 0; i < this.teamlist.length; i++) {
            for (var j = i + 1; j < this.teamlist.length; j++) {
              if (this.teamlist[i] === this.teamlist[j]) {
                this.teamlist.splice(j, 1)
                j--
              }
            }
          }
          // console.log(this.teamlist)
          for (var m = 0; m < this.projectlist.length; m++) {
            for (var n = m + 1; n < this.projectlist.length; n++) {
              if (this.projectlist[m] === this.projectlist[n]) {
                this.projectlist.splice(n, 1)
                n--
              }
            }
          }
          // console.log(this.projectlist)
          for (var h = 0; h < this.versionlist.length; h++) {
            for (var k = h + 1; k < this.versionlist.length; k++) {
              if (this.versionlist[h] === this.versionlist[k]) {
                this.versionlist.splice(k, 1)
                k--
              }
            }
          }
          // console.log(this.versionlist)
        } else {
          console.log('error')
        }
      })
    },
    selectteam: function (team) {
      this.team = team
      // console.log(this.team)
      this.projectlist = []
      this.versionlist = []
      for (var i = 0; i < this.reqdatalist.length; i++) {
        if (this.team === this.reqdatalist[i].req_team) {
          this.projectlist.push(this.reqdatalist[i].req_project)
          this.versionlist.push(this.reqdatalist[i].req_version)
        }
      }
      for (var m = 0; m < this.projectlist.length; m++) {
        for (var n = m + 1; n < this.projectlist.length; n++) {
          if (this.projectlist[m] === this.projectlist[n]) {
            this.projectlist.splice(n, 1)
            n--
          }
        }
      }
      // console.log(this.projectlist)
      for (var h = 0; h < this.versionlist.length; h++) {
        for (var k = h + 1; k < this.versionlist.length; k++) {
          if (this.versionlist[h] === this.versionlist[k]) {
            this.versionlist.splice(k, 1)
            k--
          }
        }
      }
      // console.log(this.versionlist)
    },
    selectproject: function (project) {
      this.project = project
      // this.teamlist = []
      // this.versionlist = []
      // for (var i = 0; i < this.reqdatalist.length; i++) {
      //   if (this.project === this.reqdatalist[i].req_project) {
      //     this.teamlist.push(this.reqdatalist[i].req_team)
      //     this.versionlist.push(this.reqdatalist[i].req_version)
      //   }
      // }
      // for (var m = 0; m < this.teamlist.length; m++) {
      //   for (var n = m + 1; n < this.teamlist.length; n++) {
      //     if (this.teamlist[m] === this.teamlist[n]) {
      //       this.teamlist.splice(n, 1)
      //       n--
      //     }
      //   }
      // }
      // // console.log(this.teamlist)
      // for (var h = 0; h < this.versionlist.length; h++) {
      //   for (var k = h + 1; k < this.versionlist.length; k++) {
      //     if (this.versionlist[h] === this.versionlist[k]) {
      //       this.versionlist.splice(k, 1)
      //       k--
      //     }
      //   }
      // }
    },
    selectversion: function (version) {
      this.version = version
      // this.teamlist = []
      // this.projectlist = []
      // for (var i = 0; i < this.reqdatalist.length; i++) {
      //   if (this.version === this.reqdatalist[i].req_version) {
      //     this.teamlist.push(this.reqdatalist[i].req_team)
      //     this.projectlist.push(this.reqdatalist[i].req_project)
      //   }
      // }
      // for (var m = 0; m < this.teamlist.length; m++) {
      //   for (var n = m + 1; n < this.teamlist.length; n++) {
      //     if (this.teamlist[m] === this.teamlist[n]) {
      //       this.teamlist.splice(n, 1)
      //       n--
      //     }
      //   }
      // }
      // // console.log(this.teamlist)
      // for (var h = 0; h < this.projectlist.length; h++) {
      //   for (var k = h + 1; k < this.projectlist.length; k++) {
      //     if (this.projectlist[h] === this.projectlist[k]) {
      //       this.projectlist.splice(k, 1)
      //       k--
      //     }
      //   }
      // }
    },
    SearchInfo () {
      if (this.team === '' || this.project === '' || this.version === '') {
        this.$Message.info('请选择完整信息后查询')
      } else {
        searchreqinfo({ team: this.team, project: this.project, version: this.version, username: 'liujingzu', password: 'Abc12345678' }).then(res => {
          if (res.data && res.data.data) {
            this.reqtotal = res.data.data.total
            console.log(this.reqtotal)
            this.reqdeplaytotal = res.data.data.deplaytotal
            this.reqinserttotal = res.data.data.inserttotal
            this.reqownerdata = res.data.data.owner_data
          }
        })
      }
    }
  }
}
</script>

<style>
</style>
