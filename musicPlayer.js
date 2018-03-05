/**
 * Created by zhangzhenchang on 2016/12/23.
 */
angular.module('HuaWeiMusicCMS').directive('musicPlay', ['$rootScope','$sce', function ($rootScope,$sce) {
    return {
        restrict:'EA',
        templateUrl:"templates/directives/musicPlay.html",
        replace: true,
        scope:{
            musicUrl:"=",
            imgUrl:"=",
            musicTime:"="
        },
        link:function(scope, element, attrs){
            scope.$sce=$sce;
            scope.music=element[0].children.music;
            scope.volume="";
            scope.isMute=false;
            //scope.timerMusic;
            $rootScope.timerProgress;
            scope.musicPlay=function(){
                clearInterval($rootScope.timerProgress);
                if(scope.music.paused){
                    scope.music.play();
                    var hAll=parseInt(scope.music.duration/60/60);
                    hAll=hAll>9?hAll:"0"+hAll;
                    var mAll=parseInt(scope.music.duration/60%60);
                    mAll=mAll>9?mAll:"0"+mAll;
                    var sAll=parseInt(scope.music.duration%60);
                    sAll=sAll>9?sAll:"0"+sAll;
                    scope.timeAll=hAll+":"+mAll+":"+sAll;
                    $(".progress-bar").addClass("active");
                    $(".musicPlay").removeClass("glyphicon-play").addClass("glyphicon-pause");
                    $rootScope.timerProgress=setInterval(function(){
                        $(".progress-bar")[0].style.width=(scope.music.currentTime/scope.music.duration)*100+"%";
                        $(".progressSpot")[0].style.left=(scope.music.currentTime/scope.music.duration-0.015)*100+"%";
                        var h=parseInt(scope.music.currentTime/60/60);
                        h=h>9?h:"0"+h;
                        var m=parseInt(scope.music.currentTime/60%60);
                        m=m>9?m:"0"+m;
                        var s=parseInt(scope.music.currentTime%60);
                        s=s>9?s:"0"+s;
                        $(".musicTime").html(h+":"+m+":"+s+"/"+scope.timeAll);
                    },1000);
                }else{
                    clearInterval($rootScope.timerProgress);
                    scope.music.pause();
                    $(".musicPlay").removeClass("glyphicon-pause").addClass("glyphicon-play");
                    $(".progress-bar").removeClass("active");
                }

            };
            scope.playChange= function (event) {
                var e = event || window.event;
                scope.music.currentTime=(e.offsetX/261)*parseFloat(scope.music.duration);
                $(".progress-bar")[0].style.width=(scope.music.currentTime/scope.music.duration)*100+"%";
                $(".progressSpot")[0].style.left=(scope.music.currentTime/scope.music.duration-0.015)*100+"%";
                var h=parseInt(scope.music.currentTime/60/60);
                h=h>9?h:"0"+h;
                var m=parseInt(scope.music.currentTime/60%60);
                m=m>9?m:"0"+m;
                var s=parseInt(scope.music.currentTime%60);
                s=s>9?s:"0"+s;
                $(".musicTime").html(h+":"+m+":"+s+"/"+scope.timeAll);
            };
            $(scope.music).on("ended",function(){
                $(".musicTime").html(scope.timeAll+"/"+scope.timeAll);
                $(".musicPlay").removeClass("glyphicon-pause").addClass("glyphicon-play");
                $(".progress-bar").removeClass("active");
                clearInterval($rootScope.timerProgress);
            });
            $(scope.music).on("durationchange",function(){
                $(".musicPlay").removeClass("glyphicon-pause").addClass("glyphicon-play");
                $(".progress-bar")[0].style.width=0;
                $(".progressSpot")[0].style.left=-3+"px";
                var hAll=parseInt(scope.music.duration/60/60);
                hAll=hAll>9?hAll:"0"+hAll;
                var mAll=parseInt(scope.music.duration/60%60);
                mAll=mAll>9?mAll:"0"+mAll;
                var sAll=parseInt(scope.music.duration%60);
                sAll=sAll>9?sAll:"0"+sAll;
                scope.timeAll=hAll+":"+mAll+":"+sAll;
                $(".musicTime").html("00:00:00/"+scope.timeAll);
            });
            scope.musicForward=function(){
                scope.music.currentTime=parseFloat(scope.music.currentTime)+5;
                $(".progress-bar")[0].style.width=(scope.music.currentTime/scope.music.duration)*100+"%";
                $(".progressSpot")[0].style.left=(scope.music.currentTime/scope.music.duration-0.015)*100+"%";
            };
            scope.musicBackward=function(){
                scope.music.currentTime=parseFloat(scope.music.currentTime)-5;
                $(".progress-bar")[0].style.width=(scope.music.currentTime/scope.music.duration)*100+"%";
                $(".progressSpot")[0].style.left=(scope.music.currentTime/scope.music.duration-0.015)*100+"%";
            };
            scope.volumeChange=function(event){
                var e = event || window.event;
                scope.volume=e.offsetX/87;
                scope.music.volume=scope.volume;
                $(".volumeUp")[0].style.width=scope.music.volume*100+"%";
                $(".volumeSpot")[0].style.left=(scope.music.volume-0.07)*100+"%";
            };
            scope.mute=function(){
                if(scope.music.volume!=0){
                    scope.lastVolume={
                        width:$(".volumeUp")[0].style.width,
                        left: $(".volumeSpot")[0].style.left,
                        volume:scope.music.volume
                    };
                    scope.music.volume=0;
                    $(".volumeUp")[0].style.width=0;
                    $(".volumeSpot")[0].style.left=-2+"px";
                    scope.isMute=true;
                }else{
                    scope.music.volume=scope.lastVolume.volume;
                    $(".volumeUp")[0].style.width=scope.lastVolume.width;
                    $(".volumeSpot")[0].style.left=scope.lastVolume.left;
                    scope.isMute=false;
                }
            }
        }
    };
}]);