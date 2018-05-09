Page({
    data: {
        lock: true,     //防止多次点击抽奖
        times:true,     //抽奖次数,true为有次数
        runDegs: 0,
        animationData: {},
        awards: [
            {
                'index': 0,
                'name': '再接再厉'
            },
            {
                'index': 1,
                'name': '1元话费'
            },
            {
                'index': 2,
                'name': '2元红包'
            },
            {
                'index': 3,
                'name': '3元红包'
            },
            {
                'index': 4,
                'name': '4元话费'
            },
            {
                'index': 5,
                'name': '5元话费'
            },
            {
                'index': 6,
                'name': '6元话费'
            },
            {
                'index': 7,
                'name': '7元话费'
            }
        ],
    },

    //初始化进行转盘绘制
    onReady: function (e) {
        var that = this;
        // 绘制转盘
        var awards = this.data.awards,     //获取奖品
            len = awards.length,                  //存储长度
            turnNum = 1 / len  // 文字旋转 turn 值
        for (var i in awards) {
            // 奖项列表
            awards[i].turn = i * turnNum + 'turn';
            awards[i].lineTurn = i * turnNum + turnNum / 2 + 'turn';
        }
        that.setData({
            awards: awards
        });
    },

    rotateAnimate: function (winIndex, winName){
        var that = this;
        var runNum = 5;             //固定旋转圈数
        var awardsLen = this.data.awards.length;    //奖项个数
        var runDegs = this.data.runDegs || 0;       //记录上一次旋转度数
        runDegs = runDegs + (360 - runDegs % 360) + (360 * runNum - winIndex * (360 / awardsLen));
        var animation = wx.createAnimation({
            duration: 3000,
            timingFunction: 'ease-in-out'
        })
        this.animation = animation;
        animation.rotate(runDegs).step();
        this.setData({
            animationData: animation.export(),
            runDegs: runDegs
        })
        // 中奖提示
        setTimeout(function () {
            wx.showModal({
                title: '提示',
                content: winName,
                showCancel: false
            })
            if (winIndex < 2) {
                that.setData({
                    times:false
                })
            } else {
                that.setData({
                    lock: true
                })
            }
        }, 3000);
    },

    //   抽奖按钮
    start: function () {
        var lock = this.data.lock;      //获取锁的状态
        var times = this.data.times;    //获取抽奖次数
        if(times){      //如果还有抽奖次数
            if (lock) {
                var awardsLen = this.data.awards.length;    //获取奖品数量
                var winIndex = Math.random() * awardsLen >>> 0;   //奖品
                if (winIndex == null) return;
                var winName = winIndex == 0 ? '很遗憾，再接再厉！' : '恭喜您抽中' + this.data.awards[winIndex].name;      //获取奖品名称
                this.rotateAnimate(winIndex, winName);
                this.setData({
                    lock: false             //同时上锁
                })
            }
        } else {
            wx.showModal({
                title: '提示',
                content: '抽奖次数已用完!',
                showCancel: false
            })
        }
    }

})
