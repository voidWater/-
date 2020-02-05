let num = 0
Page({
  data: {
    markers: [{
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }
      // , {
      //   id: 0,
      //   latitude: 23.099994,
      //   longitude: 113.337520,
      //   width: 50,
      //   height: 50
      // }
      // , {
      //   id: 0,
      //   latitude: 23.099994,
      //   longitude: 113.314520,
      //   width: 50,
      //   height: 50
      // }
      // , {
      //   id: 0,
      //   latitude: 23.099994,
      //   longitude: 113.304520,
      //   width: 50,
      //   height: 50
      // }
    ],

  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },

  // 动态的添加markers
  addMarkers: function () {
    num = num + 0.01
    let old = this.data.markers
    old.push({
      id: 0,
      latitude: 23.099994,
      longitude: 113.337520 + num,
      width: 50,
      height: 50
    })
    // console.log(old)
    this.setData({
      markers: old
    })
    setTimeout(() => {
      console.log(this.data.markers)
    }, 1000)
  }
}) 