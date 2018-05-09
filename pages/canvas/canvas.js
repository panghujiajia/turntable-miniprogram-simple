var app = getApp()
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: ''
    },

    //   抽奖按钮
    getLottery: function () {
        var that = this
        var awardIndex = Math.random() * 6 >>> 0;   //奖品

        // 获取奖品配置
        var awardsConfig = app.awardsConfig,
            runNum = 5;             //固定旋转圈数
        if (awardIndex < 2) awardsConfig.chance = false     //如果中奖为前两项就不能再抽奖了
        // 旋转抽奖
        app.runDegs = app.runDegs || 0
        //runDegs       旋转度数
        //runNum        旋转圈数
        //awardIndex    中奖索引
        //6             奖品总数
        app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / 5))
        var animationRun = wx.createAnimation({
            duration: 4000,
            timingFunction: 'ease'
        })
        that.animationRun = animationRun;
        animationRun.rotate(app.runDegs).step()
        that.setData({
            animationData: animationRun.export(),
            btnDisabled: 'disabled'
        })

        // 记录奖品
        var winAwards = wx.getStorageSync('winAwards') || { data: [] }
        winAwards.data.push(awardsConfig.awards[awardIndex].name + '1个')
        wx.setStorageSync('winAwards', winAwards)

        // 中奖提示
        setTimeout(function () {
            wx.showModal({
                title: '恭喜',
                content: '获得' + (awardsConfig.awards[awardIndex].name),
                showCancel: false
            })
            if (awardsConfig.chance) {
                that.setData({
                    btnDisabled: ''
                })
            }
        }, 4000);
    },
    onReady: function (e) {
        var that = this;
        // getAwardsConfig
        app.awardsConfig = {
            chance: true,           //是否可以旋转
            awards: [               //奖品
                {
                    'index': 0,
                    'name': '1元红包'
                },
                {
                    'index': 1,
                    'name': '5元话费'
                },
                {
                    'index': 2,
                    'name': '6元红包'
                },
                {
                    'index': 3,
                    'name': '8元红包'
                },
                {
                    'index': 4,
                    'name': '10元话费'
                }
            ]
        }
        // 绘制转盘
        var awardsConfig = app.awardsConfig.awards,     //获取奖品
            len = awardsConfig.length,                  //存储长度
            html = [],
            turnNum = 1 / len  // 文字旋转 turn 值
        that.setData({
            btnDisabled: app.awardsConfig.chance ? '' : 'disabled'
        })
        var ctx = wx.createContext()
        for (var i = 0; i < len; i++) {
            // 奖项列表
            html.push({
                turn: i * turnNum + 'turn',
                lineTurn: i * turnNum + turnNum / 2 + 'turn',
                award: awardsConfig[i].name
            });
        }
        console.log(html);
        that.setData({
            awardsList: html
        });
    }

})
