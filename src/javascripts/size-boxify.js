var dc = require('./tool-tipsify')();
var detectElementResize = require('detect-element-resize');

// styles
require('../../src/stylesheets/size-boxify.scss');

var sizeBoxify = function() {
  //Use old-fashioned method to create event so it works in old IE
  //https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way
  var qdResize = document.createEvent('Event');
  qdResize.initEvent('resize:qd', true, true);

  var original = {};
  var _autoResize = true;

  original.rowChart = dc.rowChart;
  dc.rowChart = function(parent, opts) {
    var _chart = original.rowChart(parent, opts);

    _chart = sizeBoxifyMixin(_chart); 

    _chart.resize = function() {
      _chart.height(_chart.getDynamicHeight())
        .width(_chart.getDynamicWidth());

      _chart.sbxPreRender()(_chart);
      _chart.render();
    };

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight());
    _chart.sbxPreRender()(_chart);
    return _chart;
  };

  original.pieChart = dc.pieChart;
  dc.pieChart = function(parent, opts) {
    var _chart = original.pieChart(parent, opts);
    var _innerRadiusRatio = (opts && opts.innerRadiusRatio && typeof opts.innerRadiusRatio === "number") ? opts.innerRadiusRatio : 13/20;
    var _centerLegend = (opts && opts.centerLegend && opts.centerLegend === true) ? true : false;
    //add 2 pixels to cx and cy to move chart enough so chart selection edges don't get cut off
    //add 2 pixels to height to accomodate moving the chart
    var edgeOffset = 2;
    var _legendOffset = 6;

    _chart = sizeBoxifyMixin(_chart);

    _chart.getDynamicRadius = function() {
      if(_chart.getDynamicHeight() < _chart.getDynamicWidth())
        return _chart.getDynamicHeight()/2;
      else
        return _chart.getDynamicWidth()/2;
    };

    _chart.getInnerRadius = function() {
      return _chart.getDynamicRadius() * _innerRadiusRatio;
    };

    _chart.resize = function() {
      _chart.height(_chart.getDynamicHeight() + (2 *edgeOffset)).width(_chart.getDynamicWidth())
        .innerRadius(_chart.getInnerRadius()).radius(_chart.getDynamicRadius())
        .cx(_chart.getDynamicRadius() + edgeOffset)
        .cy(_chart.getDynamicRadius() + edgeOffset);
      if(_centerLegend === true) {
        _chart.legend(dc.legend().x((_chart.getDynamicRadius() * 2) + 10).y(_chart.getDynamicRadius() - _legendOffset).itemHeight(12).gap(2));
      }
      else {
        _chart.legend(dc.legend().x((_chart.getDynamicRadius() * 2) + 10).y(_legendOffset).itemHeight(12).gap(2));
      }
      _chart.sbxPreRender()(_chart);
      _chart.render();
    };

    _chart.height(_chart.getDynamicHeight() + (2 * edgeOffset)).width(_chart.getDynamicWidth())
      .innerRadius(_chart.getInnerRadius()).radius(_chart.getDynamicRadius())
      .cx(_chart.getDynamicRadius() + edgeOffset)
      .cy(_chart.getDynamicRadius() + edgeOffset);
    if(_centerLegend === true) {
      _chart.legend(dc.legend().x((_chart.getDynamicRadius() * 2) + 10).y(_chart.getDynamicRadius() - _legendOffset).itemHeight(12).gap(2));
    }
    else {
      _chart.legend(dc.legend().x((_chart.getDynamicRadius() * 2) + 10).y(_legendOffset).itemHeight(12).gap(2));
    }
    _chart.sbxPreRender()(_chart);
    return _chart;
  };

  original.barChart = dc.barChart;
  dc.barChart = function(parent, opts) {
    var _chart = original.barChart(parent, opts);

    _chart = sizeBoxifyMixin(_chart);

    _chart.resize = function() {
      _chart.width(_chart.getDynamicWidth())
        .height(_chart.getDynamicHeight())
        .rescale();
      _chart.sbxPreRender()(_chart);
      _chart.render();
      _chart.redraw(); //must also redraw so filters are preserved
    };

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight());
    _chart.sbxPreRender()(_chart);
    return _chart;
  };

  original.geoChoroplethChart = dc.geoChoroplethChart;
  dc.geoChoroplethChart = function(parent, opts) {
    var _chart = original.geoChoroplethChart(parent, opts);
    var PROJECTION_WIDTH = 960;

    _chart = sizeBoxifyMixin(_chart);

    _chart.getProjectionScale = function() {
      return (_chart.getDynamicWidth()/PROJECTION_WIDTH) * 153;
    };

    _chart.getProjection = function() {
      return d3.geo.mercator().scale(_chart.getProjectionScale()).translate([_chart.getDynamicWidth()/2, _chart.getDynamicHeight()/2]);
    };

    _chart.resize = function() {
      _chart.width(_chart.getDynamicWidth())
        .height(_chart.getDynamicHeight())
        .projection(_chart.getProjection());

      _chart.sbxPreRender()(_chart);
      _chart.render();
    };


    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight())
      .projection(_chart.getProjection());
    _chart.sbxPreRender()(_chart);
    return _chart;
  };

  original.geoBubbleOverlayChart = dc.geoBubbleOverlayChart;
  dc.geoBubbleOverlayChart = function(parent, opts) {
    var _chart = original.geoBubbleOverlayChart(parent, opts);
    var PROJECTION_WIDTH = 960;
    var PROJECTION_HEIGHT = 700;
    var PROJECTION_RATIO = PROJECTION_WIDTH/PROJECTION_HEIGHT;
    var _originalScale = 150;
    var _projectionLeftOffsetModifier = {medium: 300, large: 200};
    var _projectionTopOffsetModifier = {medium: 10, large: 15};
     !function(){function t(t,a){return{type:"Feature",id:t.id,properties:t.properties,geometry:n(t.geometry,a)}}function n(t,a){if(!t)return null;if("GeometryCollection"===t.type)return{type:"GeometryCollection",geometries:object.geometries.map(function(t){return n(t,a)})};if(!Ma.hasOwnProperty(t.type))return null;var r=Ma[t.type];return d3.geo.stream(t,a(r)),r.result()}function a(){}function r(t){if((n=t.length)<4)return!1;for(var n,a=0,r=t[n-1][1]*t[0][0]-t[n-1][0]*t[0][1];++a<n;)r+=t[a-1][1]*t[a][0]-t[a-1][0]*t[a][1];return 0>=r}function e(t,n){for(var a=n[0],r=n[1],e=!1,o=0,i=t.length,h=i-1;i>o;h=o++){var u=t[o],M=u[0],s=u[1],c=t[h],f=c[0],v=c[1];s>r^v>r&&(f-M)*(r-s)/(v-s)+M>a&&(e=!e)}return e}function o(t){return t?t/Math.sin(t):1}function i(t){return t>0?1:0>t?-1:0}function h(t){return t>1?va:-1>t?-va:Math.asin(t)}function u(t){return t>1?0:-1>t?fa:Math.acos(t)}function M(t){return t>0?Math.sqrt(t):0}function s(t){function n(t,n){var a=Math.cos(t),e=Math.cos(n),o=Math.sin(n),i=e*a,h=-((1-i?Math.log(.5*(1+i))/(1-i):-.5)+r/(1+i));return[h*e*Math.sin(t),h*o]}var a=Math.tan(.5*t),r=2*Math.log(Math.cos(.5*t))/(a*a);return n.invert=function(n,a){var e,o=Math.sqrt(n*n+a*a),i=t*-.5,u=50;if(!o)return[0,0];do{var M=.5*i,s=Math.cos(M),c=Math.sin(M),f=Math.tan(M),v=Math.log(1/s);i-=e=(2/f*v-r*f-o)/(-v/(c*c)+1-r/(2*s*s))}while(Math.abs(e)>sa&&--u>0);var l=Math.sin(i);return[Math.atan2(n*l,o*Math.cos(i)),h(a*l/o)]},n}function c(){var t=va,n=pa(s),a=n(t);return a.radius=function(a){return arguments.length?n(t=a*fa/180):t/fa*180},a}function f(t,n){var a=Math.cos(n),r=o(u(a*Math.cos(t/=2)));return[2*a*Math.sin(t)*r,Math.sin(n)*r]}function v(t){function n(t,n){var h=Math.cos(n),u=Math.cos(t/=2);return[(1+h)*Math.sin(t),(e*n>-Math.atan2(u,o)-.001?0:10*-e)+i+Math.sin(n)*r-(1+h)*a*u]}var a=Math.sin(t),r=Math.cos(t),e=t>0?1:-1,o=Math.tan(e*t),i=(1+a-r)/2;return n.invert=function(t,n){var h=0,u=0,M=50;do{var s=Math.cos(h),c=Math.sin(h),f=Math.cos(u),v=Math.sin(u),l=1+f,g=l*c-t,d=i+v*r-l*a*s-n,b=.5*l*s,p=-c*v,w=.5*a*l*c,q=r*f+a*s*v,m=p*w-q*b,y=.5*(d*p-g*q)/m,S=(g*w-d*b)/m;h-=y,u-=S}while((Math.abs(y)>sa||Math.abs(S)>sa)&&--M>0);return e*u>-Math.atan2(Math.cos(h),o)-.001?[2*h,u]:null},n}function l(){var t=fa/9,n=t>0?1:-1,a=Math.tan(n*t),r=pa(v),e=r(t),o=e.stream;return e.parallel=function(e){return arguments.length?(a=Math.tan((n=(t=e*fa/180)>0?1:-1)*t),r(t)):t/fa*180},e.stream=function(r){var i=e.rotate(),h=o(r),u=(e.rotate([0,0]),o(r));return e.rotate(i),h.sphere=function(){u.polygonStart(),u.lineStart();for(var r=-180*n;180>n*r;r+=90*n)u.point(r,90*n);for(;n*(r-=t)>=-180;)u.point(r,n*-Math.atan2(Math.cos(r*ga/2),a)*da);u.lineEnd(),u.polygonEnd()},h},e}function g(t){return t=Math.exp(2*t),(t-1)/(t+1)}function d(t){return.5*(Math.exp(t)-Math.exp(-t))}function b(t){return.5*(Math.exp(t)+Math.exp(-t))}function p(t){return Math.log(t+M(t*t+1))}function w(t){return Math.log(t+M(t*t-1))}function q(t,n){var a=Math.tan(n/2),r=M(1-a*a),e=1+r*Math.cos(t/=2),o=Math.sin(t)*r/e,i=a/e,h=o*o,u=i*i;return[4/3*o*(3+h-3*u),4/3*i*(3+3*h-u)]}function m(t,n){var a=Math.abs(n);return fa/4>a?[t,Math.log(Math.tan(fa/4+n/2))]:[t*Math.cos(a)*(2*Math.SQRT2-1/Math.sin(a)),i(n)*(2*Math.SQRT2*(a-fa/4)-Math.log(Math.tan(a/2)))]}function y(t){function n(t,n){var r=qa(t,n);if(Math.abs(t)>va){var e=Math.atan2(r[1],r[0]),o=Math.sqrt(r[0]*r[0]+r[1]*r[1]),i=a*Math.round((e-va)/a)+va,u=Math.atan2(Math.sin(e-=i),2-Math.cos(e));e=i+h(fa/o*Math.sin(u))-u,r[0]=o*Math.cos(e),r[1]=o*Math.sin(e)}return r}var a=2*fa/t;return n.invert=function(t,n){var r=Math.sqrt(t*t+n*n);if(r>va){var e=Math.atan2(n,t),o=a*Math.round((e-va)/a)+va,i=e>o?-1:1,h=r*Math.cos(o-e),u=1/Math.tan(i*Math.acos((h-fa)/Math.sqrt(fa*(fa-2*h)+r*r)));e=o+2*Math.atan((u+i*Math.sqrt(u*u-3))/3),t=r*Math.cos(e),n=r*Math.sin(e)}return qa.invert(t,n)},n}function S(){var t=5,n=pa(y),a=n(t),r=a.stream,e=.01,o=-Math.cos(e*ga),i=Math.sin(e*ga);return a.lobes=function(a){return arguments.length?n(t=+a):t},a.stream=function(n){var u=a.rotate(),M=r(n),s=(a.rotate([0,0]),r(n));return a.rotate(u),M.sphere=function(){s.polygonStart(),s.lineStart();for(var n=0,a=360/t,r=2*fa/t,u=90-180/t,M=va;t>n;++n,u-=a,M-=r)s.point(Math.atan2(i*Math.cos(M),o)*da,h(i*Math.sin(M))*da),-90>u?(s.point(-90,-180-u-e),s.point(-90,-180-u+e)):(s.point(90,u+e),s.point(90,u-e));s.lineEnd(),s.polygonEnd()},M},a}function Q(t){return function(n){var a,r=t*Math.sin(n),e=30;do n-=a=(n+Math.sin(n)-r)/(1+Math.cos(n));while(Math.abs(a)>sa&&--e>0);return n/2}}function R(t,n,a){function r(a,r){return[t*a*Math.cos(r=e(r)),n*Math.sin(r)]}var e=Q(a);return r.invert=function(r,e){var o=h(e/n);return[r/(t*Math.cos(o)),h((2*o+Math.sin(2*o))/a)]},r}function T(t,n){var a=2.00276,r=ma(n);return[a*t/(1/Math.cos(n)+1.11072/Math.cos(r)),(n+Math.SQRT2*Math.sin(r))/a]}function x(t){var n=0,a=pa(t),r=a(n);return r.parallel=function(t){return arguments.length?a(n=t*fa/180):n/fa*180},r}function E(t,n){return[t*Math.cos(n),n]}function P(t){function n(n,r){var e=a+t-r,o=e?n*Math.cos(r)/e:e;return[e*Math.sin(o),a-e*Math.cos(o)]}if(!t)return E;var a=1/Math.tan(t);return n.invert=function(n,r){var e=Math.sqrt(n*n+(r=a-r)*r),o=a+t-e;return[e/Math.cos(o)*Math.atan2(n,r),o]},n}function k(t){function n(n,a){for(var r=Math.sin(a),e=Math.cos(a),o=new Array(3),M=0;3>M;++M){var s=t[M];if(o[M]=z(a-s[1],s[3],s[2],e,r,n-s[0]),!o[M][0])return s.point;o[M][1]=F(o[M][1]-s.v[1])}for(var c=u.slice(),M=0;3>M;++M){var f=2==M?0:M+1,v=B(t[M].v[0],o[M][0],o[f][0]);o[M][1]<0&&(v=-v),M?1==M?(v=i-v,c[0]-=o[M][0]*Math.cos(v),c[1]-=o[M][0]*Math.sin(v)):(v=h-v,c[0]+=o[M][0]*Math.cos(v),c[1]+=o[M][0]*Math.sin(v)):(c[0]+=o[M][0]*Math.cos(v),c[1]-=o[M][0]*Math.sin(v))}return c[0]/=3,c[1]/=3,c}t=t.map(function(t){return[t[0],t[1],Math.sin(t[1]),Math.cos(t[1])]});for(var a,r=t[2],e=0;3>e;++e,r=a)a=t[e],r.v=z(a[1]-r[1],r[3],r[2],a[3],a[2],a[0]-r[0]),r.point=[0,0];var o=B(t[0].v[0],t[2].v[0],t[1].v[0]),i=B(t[0].v[0],t[1].v[0],t[2].v[0]),h=fa-o;t[2].point[1]=0,t[0].point[0]=-(t[1].point[0]=.5*t[0].v[0]);var u=[t[2].point[0]=t[0].point[0]+t[2].v[0]*Math.cos(o),2*(t[0].point[1]=t[1].point[1]=t[2].v[0]*Math.sin(o))];return n}function _(){var t=[[0,0],[0,0],[0,0]],n=pa(k),a=n(t),r=a.rotate;return delete a.rotate,a.points=function(e){if(!arguments.length)return t;t=e;var o=d3.geo.centroid({type:"MultiPoint",coordinates:t}),i=[-o[0],-o[1]];return r.call(a,i),n(t.map(d3.geo.rotation(i)).map(A))},a.points([[-150,55],[-35,55],[-92.5,10]])}function z(t,n,a,r,e,o){var i,M=Math.cos(o);if(Math.abs(t)>1||Math.abs(o)>1)i=u(a*e+n*r*M);else{var s=Math.sin(.5*t),c=Math.sin(.5*o);i=2*h(Math.sqrt(s*s+n*r*c*c))}return Math.abs(i)>sa?[i,Math.atan2(r*Math.sin(o),n*e-a*r*M)]:[0,0]}function B(t,n,a){return u(.5*(t*t+n*n-a*a)/(t*n))}function F(t){return t-2*fa*Math.floor((t+fa)/(2*fa))}function A(t){return[t[0]*ga,t[1]*ga]}function G(t,n){var a=M(1-Math.sin(n));return[2/la*t*a,la*(1-a)]}function j(t){function n(t,n){return[t,(t?t/Math.sin(t):1)*(Math.sin(n)*Math.cos(t)-a*Math.cos(n))]}var a=Math.tan(t);return n.invert=a?function(t,n){t&&(n*=Math.sin(t)/t);var r=Math.cos(t);return[t,2*Math.atan2(Math.sqrt(r*r+a*a-n*n)-r,a-n)]}:function(t,n){return[t,h(t?n*Math.tan(t)/t:n)]},n}function C(t,n){var a=Math.sqrt(3);return[a*t*(2*Math.cos(2*n/3)-1)/la,a*la*Math.sin(n/3)]}function D(t){function n(t,n){return[t*a,Math.sin(n)/a]}var a=Math.cos(t);return n.invert=function(t,n){return[t/a,h(n*a)]},n}function L(t){function n(t,n){return[t*a,(1+a)*Math.tan(.5*n)]}var a=Math.cos(t);return n.invert=function(t,n){return[t/a,2*Math.atan(n/(1+a))]},n}function O(t,n){var a=Math.sqrt(8/(3*fa));return[a*t*(1-Math.abs(n)/fa),a*n]}function H(t,n){var a=Math.sqrt(4-3*Math.sin(Math.abs(n)));return[2/Math.sqrt(6*fa)*t*a,i(n)*Math.sqrt(2*fa/3)*(2-a)]}function I(t,n){var a=Math.sqrt(fa*(4+fa));return[2/a*t*(1+Math.sqrt(1-4*n*n/(fa*fa))),4/a*n]}function J(t,n){var a=(2+va)*Math.sin(n);n/=2;for(var r=0,e=1/0;10>r&&Math.abs(e)>sa;r++){var o=Math.cos(n);n-=e=(n+Math.sin(n)*(o+2)-a)/(2*o*(1+o))}return[2/Math.sqrt(fa*(4+fa))*t*(1+Math.cos(n)),2*Math.sqrt(fa/(4+fa))*Math.sin(n)]}function K(t,n){return[t*(1+Math.cos(n))/Math.sqrt(2+fa),2*n/Math.sqrt(2+fa)]}function N(t,n){for(var a=(1+va)*Math.sin(n),r=0,e=1/0;10>r&&Math.abs(e)>sa;r++)n-=e=(n+Math.sin(n)-a)/(1+Math.cos(n));return a=Math.sqrt(2+fa),[t*(1+Math.cos(n))/a,2*n/a]}function U(t,n){var a=Math.sin(t/=2),r=Math.cos(t),e=Math.sqrt(Math.cos(n)),o=Math.cos(n/=2),i=Math.sin(n)/(o+Math.SQRT2*r*e),h=Math.sqrt(2/(1+i*i)),u=Math.sqrt((Math.SQRT2*o+(r+a)*e)/(Math.SQRT2*o+(r-a)*e));return[Qa*(h*(u-1/u)-2*Math.log(u)),Qa*(h*i*(u+1/u)-2*Math.atan(i))]}function V(t,n){var a=Math.tan(n/2);return[t*Ra*M(1-a*a),(1+Ra)*a]}function W(t,n){var a=n/2,r=Math.cos(a);return[2*t/la*Math.cos(n)*r*r,la*Math.tan(a)]}function X(t,n,a,r,e,o,i,h){function u(u,M){if(!M)return[t*u/fa,0];var s=M*M,c=t+s*(n+s*(a+s*r)),f=M*(e-1+s*(o-h+s*i)),v=(c*c+f*f)/(2*f),l=u*Math.asin(c/v)/fa;return[v*Math.sin(l),M*(1+s*h)+v*(1-Math.cos(l))]}return arguments.length<8&&(h=0),u.invert=function(u,s){var c,f,v=fa*u/t,l=s,g=50;do{var d=l*l,b=t+d*(n+d*(a+d*r)),p=l*(e-1+d*(o-h+d*i)),w=b*b+p*p,q=2*p,m=w/q,y=m*m,S=Math.asin(b/m)/fa,Q=v*S;if(xB2=b*b,dxBdφ=(2*n+d*(4*a+6*d*r))*l,dyBdφ=e+d*(3*o+5*d*i),dpdφ=2*(b*dxBdφ+p*(dyBdφ-1)),dqdφ=2*(dyBdφ-1),dmdφ=(dpdφ*q-w*dqdφ)/(q*q),cosα=Math.cos(Q),sinα=Math.sin(Q),mcosα=m*cosα,msinα=m*sinα,dαdφ=v/fa*(1/M(1-xB2/y))*(dxBdφ*m-b*dmdφ)/y,fx=msinα-u,fy=l*(1+d*h)+m-mcosα-s,δxδφ=dmdφ*sinα+mcosα*dαdφ,δxδλ=mcosα*S,δyδφ=1+dmdφ-(dmdφ*cosα-msinα*dαdφ),δyδλ=msinα*S,denominator=δxδφ*δyδλ-δyδφ*δxδλ,!denominator)break;v-=c=(fy*δxδφ-fx*δyδφ)/denominator,l-=f=(fx*δyδλ-fy*δxδλ)/denominator}while((Math.abs(c)>sa||Math.abs(f)>sa)&&--g>0);return[v,l]},u}function Y(t,n){var a=t*t,r=n*n;return[t*(1-.162388*r)*(.87-952426e-9*a*a),n*(1+r/12)]}function Z(t){function n(){var t=!1,n=pa(a),r=n(t);return r.quincuncial=function(a){return arguments.length?n(t=!!a):t},r}function a(n){var a=n?function(n,a){var e=Math.abs(n)<va,o=t(e?n:n>0?n-fa:n+fa,a),h=(o[0]-o[1])*Math.SQRT1_2,u=(o[0]+o[1])*Math.SQRT1_2;if(e)return[h,u];var M=r*Math.SQRT1_2,s=h>0^u>0?-1:1;return[s*h-i(u)*M,s*u-i(h)*M]}:function(n,a){var e=n>0?-.5:.5,o=t(n+e*fa,a);return o[0]-=e*r,o};return t.invert&&(a.invert=n?function(n,a){var e=(n+a)*Math.SQRT1_2,o=(a-n)*Math.SQRT1_2,i=Math.abs(e)<.5*r&&Math.abs(o)<.5*r;if(!i){var h=r*Math.SQRT1_2,u=e>0^o>0?-1:1,M=-u*(n+(o>0?1:-1)*h),s=-u*(a+(e>0?1:-1)*h);e=(-M-s)*Math.SQRT1_2,o=(M-s)*Math.SQRT1_2}var c=t.invert(e,o);return i||(c[0]+=e>0?fa:-fa),c}:function(n,a){var e=n>0?-.5:.5,o=t.invert(n+e*r,a),i=o[0]-e*fa;return-fa>i?i+=2*fa:i>fa&&(i-=2*fa),o[0]=i,o}),a}var r=t(va,0)[0]-t(-va,0)[0];return n.raw=a,n}function $(t,n){var a=i(t),r=i(n),e=Math.cos(n),o=Math.cos(t)*e,u=Math.sin(t)*e,M=Math.sin(r*n);t=Math.abs(Math.atan2(u,M)),n=h(o),Math.abs(t-va)>sa&&(t%=va);var s=tn(t>fa/4?va-t:t,n);return t>fa/4&&(M=s[0],s[0]=-s[1],s[1]=-M),s[0]*=a,s[1]*=-r,s}function tn(t,n){if(n===va)return[0,0];var a=Math.sin(n),r=a*a,e=r*r,o=1+e,i=1+3*e,u=1-e,s=h(1/Math.sqrt(o)),c=u+r*o*s,f=(1-a)/c,v=Math.sqrt(f),l=f*o,g=Math.sqrt(l),d=v*u;if(0===t)return[0,-(d+r*g)];var b=Math.cos(n),p=1/b,w=2*a*b,q=(-3*r+s*i)*w,m=(-c*b-(1-a)*q)/(c*c),y=.5*m/v,S=u*y-2*r*v*w,Q=r*o*m+f*i*w,R=-p*w,T=-p*Q,x=-2*p*S,E=4*t/fa;if(t>.222*fa||fa/4>n&&t>.175*fa){var P=(d+r*M(l*(1+e)-d*d))/(1+e);if(t>fa/4)return[P,P];var k=P,_=.5*P,z=50;P=.5*(_+k);do{var B=Math.sqrt(l-P*P),F=P*(x+R*B)+T*h(P/g)-E;if(!F)break;0>F?_=P:k=P,P=.5*(_+k)}while(Math.abs(k-_)>sa&&--z>0)}else{var A,P=sa,z=25;do{var G=P*P,B=M(l-G),j=x+R*B,F=P*j+T*h(P/g)-E,C=j+(T-R*G)/B;P-=A=B?F/C:0}while(Math.abs(A)>sa&&--z>0)}return[P,-d-r*M(l-P*P)]}function nn(t,n){for(var a=0,r=1,e=.5,o=50;;){var i=e*e,h=Math.sqrt(e),u=Math.asin(1/Math.sqrt(1+i)),M=1-i+e*(1+i)*u,s=(1-h)/M,c=Math.sqrt(s),f=s*(1+i),v=c*(1-i),l=f-t*t,g=Math.sqrt(l),d=n+v+e*g;if(Math.abs(r-a)<ca||0===--o||0===d)break;d>0?a=e:r=e,e=.5*(a+r)}if(!o)return null;var b=Math.asin(h),p=Math.cos(b),w=1/p,q=2*h*p,m=(-3*e+u*(1+3*i))*q,y=(-M*p-(1-h)*m)/(M*M),S=.5*y/c,Q=(1-i)*S-2*e*c*q,R=-2*w*Q,T=-w*q,x=-w*(e*(1+i)*y+s*(1+3*i)*q);return[fa/4*(t*(R+T*g)+x*Math.asin(t/Math.sqrt(f))),b]}function an(t,n,a){if(!t){var r=rn(n,1-a);return[[0,r[0]/r[1]],[1/r[1],0],[r[2]/r[1],0]]}var e=rn(t,a);if(!n)return[[e[0],0],[e[1],0],[e[2],0]];var r=rn(n,1-a),o=r[1]*r[1]+a*e[0]*e[0]*r[0]*r[0];return[[e[0]*r[2]/o,e[1]*e[2]*r[0]*r[1]/o],[e[1]*r[1]/o,-e[0]*e[2]*r[0]*r[2]/o],[e[2]*r[1]*r[2]/o,-a*e[0]*e[1]*r[0]/o]]}function rn(t,n){var a,r,e,o,i;if(sa>n)return o=Math.sin(t),r=Math.cos(t),a=.25*n*(t-o*r),[o-a*r,r+a*o,1-.5*n*o*o,t-a];if(n>=1-sa)return a=.25*(1-n),r=b(t),o=g(t),e=1/r,i=r*d(t),[o+a*(i-t)/(r*r),e-a*o*e*(i-t),e+a*o*e*(i+t),2*Math.atan(Math.exp(t))-va+a*(i-t)/r];var u=[1,0,0,0,0,0,0,0,0],s=[Math.sqrt(n),0,0,0,0,0,0,0,0],c=0;for(r=Math.sqrt(1-n),i=1;Math.abs(s[c]/u[c])>sa&&8>c;)a=u[c++],s[c]=.5*(a-r),u[c]=.5*(a+r),r=M(a*r),i*=2;e=i*u[c]*t;do o=s[c]*Math.sin(r=e)/u[c],e=.5*(h(o)+e);while(--c);return[Math.sin(e),o=Math.cos(e),o/Math.cos(e-r),e]}function en(t,n,a){var r=Math.abs(t),e=Math.abs(n),o=d(e);if(r){var h=1/Math.sin(r),u=1/(Math.tan(r)*Math.tan(r)),s=-(u+a*o*o*h*h-1+a),c=(a-1)*u,f=.5*(-s+Math.sqrt(s*s-4*c));return[on(Math.atan(1/Math.sqrt(f)),a)*i(t),on(Math.atan(M((f/u-1)/a)),1-a)*i(n)]}return[0,on(Math.atan(o),1-a)*i(n)]}function on(t,n){if(!n)return t;if(1===n)return Math.log(Math.tan(t/2+fa/4));for(var a=1,r=Math.sqrt(1-n),e=Math.sqrt(n),o=0;Math.abs(e)>sa;o++){if(t%fa){var i=Math.atan(r*Math.tan(t)/a);0>i&&(i+=fa),t+=i+~~(t/fa)*fa}else t+=t;e=(a+r)/2,r=Math.sqrt(a*r),e=((a=e)-r)/2}return t/(Math.pow(2,o)*a)}function hn(t,n){var a=(Math.SQRT2-1)/(Math.SQRT2+1),r=Math.sqrt(1-a*a),e=on(va,r*r),o=-1,i=Math.log(Math.tan(fa/4+Math.abs(n)/2)),h=Math.exp(o*i)/Math.sqrt(a),u=un(h*Math.cos(o*t),h*Math.sin(o*t)),M=en(u[0],u[1],r*r);return[-M[1],(n>=0?1:-1)*(.5*e-M[0])]}function un(t,n){var a=t*t,r=n+1,e=1-a-n*n;return[.5*((t>=0?va:-va)-Math.atan2(e,2*t)),-.25*Math.log(e*e+4*a)+.5*Math.log(r*r+a)]}function Mn(t,n){var a=n[0]*n[0]+n[1]*n[1];return[(t[0]*n[0]+t[1]*n[1])/a,(t[1]*n[0]-t[0]*n[1])/a]}function sn(t){function n(t,n){var o=e(t,n);t=o[0],n=o[1];var i=Math.sin(n),h=Math.cos(n),M=Math.cos(t),s=u(a*i+r*h*M),c=Math.sin(s),f=Math.abs(c)>sa?s/c:1;return[f*r*Math.sin(t),(Math.abs(t)>va?f:-f)*(a*h-r*i*M)]}var a=Math.sin(t),r=Math.cos(t),e=cn(t);return e.invert=cn(-t),n.invert=function(t,n){var r=Math.sqrt(t*t+n*n),o=-Math.sin(r),i=Math.cos(r),h=r*i,u=-n*o,s=r*a,c=M(h*h+u*u-s*s),f=Math.atan2(h*s+u*c,u*s-h*c),v=(r>va?-1:1)*Math.atan2(t*o,r*Math.cos(f)*i+n*Math.sin(f)*o);return e.invert(v,f)},n}function cn(t){var n=Math.sin(t),a=Math.cos(t);return function(t,r){var e=Math.cos(r),o=Math.cos(t)*e,i=Math.sin(t)*e,u=Math.sin(r);return[Math.atan2(i,o*a-u*n),h(u*a+o*n)]}}function fn(){var t=0,n=pa(sn),a=n(t),r=a.rotate,e=a.stream,o=d3.geo.circle();return a.parallel=function(r){if(!arguments.length)return t/fa*180;var e=a.rotate();return n(t=r*fa/180).rotate(e)},a.rotate=function(n){return arguments.length?(r.call(a,[n[0],n[1]-t/fa*180]),o.origin([-n[0],-n[1]]),a):(n=r.call(a),n[1]+=t/fa*180,n)},a.stream=function(t){return t=e(t),t.sphere=function(){t.polygonStart();var n,a=.01,r=o.angle(90-a)().coordinates[0],e=r.length-1,i=-1;for(t.lineStart();++i<e;)t.point((n=r[i])[0],n[1]);for(t.lineEnd(),r=o.angle(90+a)().coordinates[0],e=r.length-1,t.lineStart();--i>=0;)t.point((n=r[i])[0],n[1]);t.lineEnd(),t.polygonEnd()},t},a}function vn(t,n){function a(a,r){var e=ka(a/n,r);return e[0]*=t,e}return arguments.length<2&&(n=t),1===n?ka:1/0===n?gn:(a.invert=function(a,r){var e=ka.invert(a/t,r);return e[0]*=n,e},a)}function ln(){var t=2,n=pa(vn),a=n(t);return a.coefficient=function(a){return arguments.length?n(t=+a):t},a}function gn(t,n){return[t*Math.cos(n)/Math.cos(n/=2),2*Math.sin(n)]}function dn(t,n){for(var a,r=Math.sin(n)*(0>n?2.43763:2.67595),e=0;20>e&&(n-=a=(n+Math.sin(n)-r)/(1+Math.cos(n)),!(Math.abs(a)<sa));e++);return[.85*t*Math.cos(n*=.5),Math.sin(n)*(0>n?1.93052:1.75859)]}function bn(t){function n(n,s){var c,f=Math.abs(s);if(f>r){var v=Math.min(t-1,Math.max(0,Math.floor((n+fa)/M)));n+=fa*(t-1)/t-v*M,c=d3.geo.collignon.raw(n,f),c[0]=c[0]*e/o-e*(t-1)/(2*t)+v*e/t,c[1]=i+4*(c[1]-h)*u/e,0>s&&(c[1]=-c[1])}else c=a(n,s);return c[0]/=2,c}var a=d3.geo.cylindricalEqualArea.raw(0),r=_a*fa/180,e=2*fa,o=d3.geo.collignon.raw(fa,r)[0]-d3.geo.collignon.raw(-fa,r)[0],i=a(0,r)[1],h=d3.geo.collignon.raw(0,r)[1],u=d3.geo.collignon.raw(0,va)[1]-h,M=2*fa/t;return n.invert=function(n,r){n*=2;var s=Math.abs(r);if(s>i){var c=Math.min(t-1,Math.max(0,Math.floor((n+fa)/M)));n=(n+fa*(t-1)/t-c*M)*o/e;var f=d3.geo.collignon.raw.invert(n,.25*(s-i)*e/u+h);return f[0]-=fa*(t-1)/t-c*M,0>r&&(f[1]=-f[1]),f}return a.invert(n,r)},n}function pn(){function t(){var t=180/n;return{type:"Polygon",coordinates:[d3.range(-180,180+t/2,t).map(function(t,n){return[t,1&n?90-1e-6:_a]}).concat(d3.range(180,-180-t/2,-t).map(function(t,n){return[t,1&n?-90+1e-6:-_a]}))]}}var n=2,a=pa(bn),r=a(n),e=r.stream;return r.lobes=function(t){return arguments.length?a(n=+t):n},r.stream=function(n){var a=r.rotate(),o=e(n),i=(r.rotate([0,0]),e(n));return r.rotate(a),o.sphere=function(){d3.geo.stream(t(),i)},o},r}function wn(t){function n(n,e){var h,u,f=1-Math.sin(e);if(f&&2>f){var v,l=va-e,g=25;do{var d=Math.sin(l),b=Math.cos(l),p=o+Math.atan2(d,r-b),w=1+c-2*r*b;l-=v=(l-s*o-r*d+w*p-.5*f*a)/(2*r*d*p)}while(Math.abs(v)>ca&&--g>0);h=i*Math.sqrt(w),u=n*p/fa}else h=i*(t+f),u=n*o/fa;return[h*Math.sin(u),M-h*Math.cos(u)]}var a,r=1+t,e=Math.sin(1/r),o=h(e),i=2*Math.sqrt(fa/(a=fa+4*o*r)),M=.5*i*(r+Math.sqrt(t*(2+t))),s=t*t,c=r*r;return n.invert=function(t,n){var e=t*t+(n-=M)*n,f=(1+c-e/(i*i))/(2*r),v=u(f),l=Math.sin(v),g=o+Math.atan2(l,r-f);return[h(t/Math.sqrt(e))*fa/g,h(1-2*(v-s*o-r*l+(1+c-2*r*f)*g)/a)]},n}function qn(){var t=1,n=pa(wn),a=n(t);return a.ratio=function(a){return arguments.length?n(t=+a):t},a}function mn(t,n){return n>-za?(t=ya(t,n),t[1]+=Ba,t):E(t,n)}function yn(t,n){return Math.abs(n)>za?(t=ya(t,n),t[1]-=n>0?Ba:-Ba,t):E(t,n)}function Sn(t,n){return[3*t/(2*fa)*Math.sqrt(fa*fa/3-n*n),n]}function Qn(t){function n(n,a){if(Math.abs(Math.abs(a)-va)<sa)return[0,0>a?-2:2];var r=Math.sin(a),e=Math.pow((1+r)/(1-r),t/2),o=.5*(e+1/e)+Math.cos(n*=t);return[2*Math.sin(n)/o,(e-1/e)/o]}return n.invert=function(n,a){var r=Math.abs(a);if(Math.abs(r-2)<sa)return n?null:[0,i(a)*va];if(r>2)return null;n/=2,a/=2;var e=n*n,o=a*a,u=2*a/(1+e+o);return u=Math.pow((1+u)/(1-u),1/t),[Math.atan2(2*n,1-e-o)/t,h((u-1)/(u+1))]},n}function Rn(){var t=.5,n=pa(Qn),a=n(t);return a.spacing=function(a){return arguments.length?n(t=+a):t},a}function Tn(t,n){return[t*(1+Math.sqrt(Math.cos(n)))/2,n/(Math.cos(n/2)*Math.cos(t/6))]}function xn(t,n){var a=t*t,r=n*n;return[t*(.975534+r*(-.119161+a*-.0143059+r*-.0547009)),n*(1.00384+a*(.0802894+r*-.02855+199025e-9*a)+r*(.0998909+r*-.0491032))]}function En(t,n){return[Math.sin(t)/Math.cos(n),Math.tan(n)*Math.cos(t)]}function Pn(t){function n(n,e){var o=e-t,i=Math.abs(o)<sa?n*a:Math.abs(i=fa/4+e/2)<sa||Math.abs(Math.abs(i)-va)<sa?0:n*o/Math.log(Math.tan(i)/r);return[i,o]}var a=Math.cos(t),r=Math.tan(fa/4+t/2);return n.invert=function(n,e){var o,i=e+t;return[Math.abs(e)<sa?n/a:Math.abs(o=fa/4+i/2)<sa||Math.abs(Math.abs(o)-va)<sa?0:n*Math.log(Math.tan(o)/r)/e,i]},n}function kn(t,n){return[t,1.25*Math.log(Math.tan(fa/4+.4*n))]}function _n(t){function n(n,r){for(var e,o=Math.cos(r),i=2/(1+o*Math.cos(n)),h=i*o*Math.sin(n),u=i*Math.sin(r),M=a,s=t[M],c=s[0],f=s[1];--M>=0;)s=t[M],c=s[0]+h*(e=c)-u*f,f=s[1]+h*f+u*e;return c=h*(e=c)-u*f,f=h*f+u*e,[c,f]}var a=t.length-1;return n.invert=function(n,r){var e=20,o=n,i=r;do{for(var u,M=a,s=t[M],c=s[0],f=s[1],v=0,l=0;--M>=0;)s=t[M],v=c+o*(u=v)-i*l,l=f+o*l+i*u,c=s[0]+o*(u=c)-i*f,f=s[1]+o*f+i*u;v=c+o*(u=v)-i*l,l=f+o*l+i*u,c=o*(u=c)-i*f-n,f=o*f+i*u-r;var g,d,b=v*v+l*l;o-=g=(c*v+f*l)/b,i-=d=(f*v-c*l)/b}while(Math.abs(g)+Math.abs(d)>sa*sa&&--e>0);if(e){var p=Math.sqrt(o*o+i*i),w=2*Math.atan(.5*p),q=Math.sin(w);return[Math.atan2(o*q,p*Math.cos(w)),p?h(i*q/p):0]}},n}function zn(){var t=Fa.miller,n=pa(_n),a=n(t);return a.coefficients=function(a){return arguments.length?n(t="string"==typeof a?Fa[a]:a):t},a}function Bn(t,n){var a=Math.sqrt(6),r=Math.sqrt(7),e=Math.asin(7*Math.sin(n)/(3*a));return[a*t*(2*Math.cos(2*e/3)-1)/r,9*Math.sin(e/3)/r]}function Fn(t,n){for(var a,r=(1+Math.SQRT1_2)*Math.sin(n),e=n,o=0;25>o&&(e-=a=(Math.sin(e/2)+Math.sin(e)-r)/(.5*Math.cos(e/2)+Math.cos(e)),!(Math.abs(a)<sa));o++);return[t*(1+2*Math.cos(e)/Math.cos(e/2))/(3*Math.SQRT2),2*Math.sqrt(3)*Math.sin(e/2)/Math.sqrt(2+Math.SQRT2)]}function An(t,n){for(var a,r=Math.sqrt(6/(4+fa)),e=(1+fa/4)*Math.sin(n),o=n/2,i=0;25>i&&(o-=a=(o/2+Math.sin(o)-e)/(.5+Math.cos(o)),!(Math.abs(a)<sa));i++);return[r*(.5+Math.cos(o))*t/1.5,r*o]}function Gn(t,n){var a=n*n,r=a*a;return[t*(.8707-.131979*a+r*(-.013791+r*(.003971*a-.001529*r))),n*(1.007226+a*(.015085+r*(-.044475+.028874*a-.005916*r)))]}function jn(t,n){return[t*(1+Math.cos(n))/2,2*(n-Math.tan(n/2))]}function Cn(t,n){if(Math.abs(n)<sa)return[t,0];var a=Math.tan(n),r=t*Math.sin(n);return[Math.sin(r)/a,n+(1-Math.cos(r))/a]}function Dn(t){function n(n,r){var e=a?Math.tan(n*a/2)/a:n/2;if(!r)return[2*e,-t];var o=2*Math.atan(e*Math.sin(r)),i=1/Math.tan(r);return[Math.sin(o)*i,r+(1-Math.cos(o))*i-t]}var a=Math.sin(t);return n.invert=function(n,r){if(Math.abs(r+=t)<sa)return[a?2*Math.atan(a*n/2)/a:n,0];var e,o=n*n+r*r,i=0,M=10;do{var s=Math.tan(i),c=1/Math.cos(i),f=o-2*r*i+i*i;i-=e=(s*f+2*(i-r))/(2+f*c*c+2*(i-r)*s)}while(Math.abs(e)>sa&&--M>0);var v=n*(s=Math.tan(i)),l=Math.tan(Math.abs(r)<Math.abs(i+1/s)?.5*h(v):.5*u(v)+fa/4)/Math.sin(i);return[a?2*Math.atan(a*l)/a:2*l,i]},n}function Ln(t,n){var a,r=Math.min(18,36*Math.abs(n)/fa),e=Math.floor(r),o=r-e,i=(a=Ga[e])[0],h=a[1],u=(a=Ga[++e])[0],M=a[1],s=(a=Ga[Math.min(19,++e)])[0],c=a[1];return[t*(u+o*(s-i)/2+o*o*(s-2*u+i)/2),(n>0?va:-va)*(M+o*(c-h)/2+o*o*(c-2*M+h)/2)]}function On(t){function n(n,a){var r=Math.cos(a),e=(t-1)/(t-r*Math.cos(n));return[e*r*Math.sin(n),e*Math.sin(a)]}return n.invert=function(n,a){var r=n*n+a*a,e=Math.sqrt(r),o=(t-Math.sqrt(1-r*(t+1)/(t-1)))/((t-1)/e+e/(t-1));return[Math.atan2(n*o,e*Math.sqrt(1-o*o)),e?h(a*o/e):0]},n}function Hn(t,n){function a(n,a){var i=r(n,a),h=i[1],u=h*o/(t-1)+e;return[i[0]*e/u,h/u]}var r=On(t);if(!n)return r;var e=Math.cos(n),o=Math.sin(n);return a.invert=function(n,a){var i=(t-1)/(t-1-a*o);return r.invert(i*n,i*a*e)},a}function In(){var t=1.4,n=0,a=pa(Hn),r=a(t,n);return r.distance=function(r){return arguments.length?a(t=+r,n):t},r.tilt=function(r){return arguments.length?a(t,n=r*fa/180):180*n/fa},r}function Jn(t,n){var a=Math.tan(n/2),r=Math.sin(fa/4*a);return[t*(.74482-.34588*r*r),1.70711*a]}function Kn(t){function n(n,o){var i=u(Math.cos(o)*Math.cos(n-a)),h=u(Math.cos(o)*Math.cos(n-r)),s=0>o?-1:1;return i*=i,h*=h,[(i-h)/(2*t),s*M(4*e*h-(e-i+h)*(e-i+h))/(2*t)]}if(!t)return d3.geo.azimuthalEquidistant.raw;var a=-t/2,r=-a,e=t*t,o=Math.tan(r),i=.5/Math.sin(r);return n.invert=function(t,n){var e,h,M=n*n,s=Math.cos(Math.sqrt(M+(e=t+a)*e)),c=Math.cos(Math.sqrt(M+(e=t+r)*e));return[Math.atan2(h=s-c,e=(s+c)*o),(0>n?-1:1)*u(Math.sqrt(e*e+h*h)*i)]},n}function Nn(){var t=[[0,0],[0,0]],n=pa(Kn),a=n(0),r=a.rotate;return delete a.rotate,a.points=function(a){if(!arguments.length)return t;t=a;var e=d3.geo.interpolate(a[0],a[1]),o=e(.5),i=d3.geo.rotation([-o[0],-o[1]])(a[0]),u=.5*e.distance,M=(i[0]<0?-1:1)*i[1]*ga,s=h(Math.sin(M)/Math.sin(u));return r.call(i,[-o[0],-o[1],-s*da]),n(2*u)},a}function Un(t){function n(t,n){var r=d3.geo.gnomonic.raw(t,n);return r[0]*=a,r}var a=Math.cos(t);return n.invert=function(t,n){return d3.geo.gnomonic.raw.invert(t/a,n)},n}function Vn(){var t=[[0,0],[0,0]],n=pa(Un),a=n(0),r=a.rotate;return delete a.rotate,a.points=function(a){if(!arguments.length)return t;t=a;var e=d3.geo.interpolate(a[0],a[1]),o=e(.5),i=d3.geo.rotation([-o[0],-o[1]])(a[0]),u=.5*e.distance,M=(i[0]<0?-1:1)*i[1]*ga,s=h(Math.sin(M)/Math.sin(u));return r.call(i,[-o[0],-o[1],-s*da]),n(u)},a}function Wn(t,n){if(Math.abs(n)<sa)return[t,0];var a=Math.abs(n/va),r=h(a);if(Math.abs(t)<sa||Math.abs(Math.abs(n)-va)<sa)return[0,i(n)*fa*Math.tan(r/2)];var e=Math.cos(r),o=Math.abs(fa/t-t/fa)/2,u=o*o,M=e/(a+e-1),s=M*(2/a-1),c=s*s,f=c+u,v=M-c,l=u+M;return[i(t)*fa*(o*v+Math.sqrt(u*v*v-f*(M*M-c)))/f,i(n)*fa*(s*l-o*Math.sqrt((u+1)*f-l*l))/f]}function Xn(t,n){if(Math.abs(n)<sa)return[t,0];var a=Math.abs(n/va),r=h(a);if(Math.abs(t)<sa||Math.abs(Math.abs(n)-va)<sa)return[0,i(n)*fa*Math.tan(r/2)];var e=Math.cos(r),o=Math.abs(fa/t-t/fa)/2,u=o*o,s=e*(Math.sqrt(1+u)-o*e)/(1+u*a*a);return[i(t)*fa*s,i(n)*fa*M(1-s*(2*o+s))]}function Yn(t,n){if(Math.abs(n)<sa)return[t,0];var a=n/va,r=h(a);if(Math.abs(t)<sa||Math.abs(Math.abs(n)-va)<sa)return[0,fa*Math.tan(r/2)];var e=(fa/t-t/fa)/2,o=a/(1+Math.cos(r));return[fa*(i(t)*M(e*e+1-o*o)-e),fa*o]}function Zn(t,n){if(!n)return[t,0];var a=Math.abs(n);if(!t||a===va)return[0,n];var r=a/va,e=r*r,o=(8*r-e*(e+2)-5)/(2*e*(r-1)),h=o*o,u=r*o,s=e+h+2*u,c=r+3*o,f=t/va,v=f+1/f,l=i(Math.abs(t)-va)*Math.sqrt(v*v-4),g=l*l,d=s*(e+h*g-1)+(1-e)*(e*(c*c+4*h)+12*u*h+4*h*h),b=(l*(s+h-1)+2*M(d))/(4*s+g);return[i(t)*va*b,i(n)*va*M(1+l*Math.abs(b)-b*b)]}function $n(t,n){return[t*Math.sqrt(1-3*n*n/(fa*fa)),n]}function ta(t,n){var a=.90631*Math.sin(n),r=Math.sqrt(1-a*a),e=Math.sqrt(2/(1+r*Math.cos(t/=3)));return[2.66723*r*e*Math.sin(t),1.24104*a*e]}function na(t,n){var a=Math.cos(n),r=Math.cos(t)*a,e=1-r,o=Math.cos(t=Math.atan2(Math.sin(t)*a,-Math.sin(n))),i=Math.sin(t);return a=M(1-r*r),[i*a-o*e,-o*a-i*e]}function aa(t,n){var a=f(t,n);return[(a[0]+t/va)/2,(a[1]+n)/2]}d3.geo.project=function(t,a){var r=a.stream;if(!r)throw new Error("not yet supported");return(t&&ra.hasOwnProperty(t.type)?ra[t.type]:n)(t,r)};var ra={Feature:t,FeatureCollection:function(n,a){return{type:"FeatureCollection",features:n.features.map(function(n){return t(n,a)})}}},ea=[],oa=[],ia={point:function(t,n){ea.push([t,n])},result:function(){var t=ea.length?ea.length<2?{type:"Point",coordinates:ea[0]}:{type:"MultiPoint",coordinates:ea}:null;return ea=[],t}},ha={lineStart:a,point:function(t,n){ea.push([t,n])},lineEnd:function(){ea.length&&(oa.push(ea),ea=[])},result:function(){var t=oa.length?oa.length<2?{type:"LineString",coordinates:oa[0]}:{type:"MultiLineString",coordinates:oa}:null;return oa=[],t}},ua={polygonStart:a,lineStart:a,point:function(t,n){ea.push([t,n])},lineEnd:function(){var t=ea.length;if(t){do ea.push(ea[0].slice());while(++t<4);oa.push(ea),ea=[]}},polygonEnd:a,result:function(){if(!oa.length)return null;var t=[],n=[];return oa.forEach(function(a){r(a)?t.push([a]):n.push(a)}),n.forEach(function(n){var a=n[0];t.some(function(t){return e(t[0],a)?(t.push(n),!0):void 0})||t.push([n])}),oa=[],t.length?t.length>1?{type:"MultiPolygon",coordinates:t}:{type:"Polygon",coordinates:t[0]}:null}},Ma={Point:ia,MultiPoint:ia,LineString:ha,MultiLineString:ha,Polygon:ua,MultiPolygon:ua},sa=1e-6,ca=sa*sa,fa=Math.PI,va=fa/2,la=Math.sqrt(fa),ga=fa/180,da=180/fa,ba=d3.geo.projection,pa=d3.geo.projectionMutator;d3.geo.interrupt=function(t){function n(n,a){for(var r=0>a?-1:1,e=h[+(0>a)],o=0,i=e.length-1;i>o&&n>e[o][2][0];++o);var u=t(n-e[o][1][0],a);return u[0]+=t(e[o][1][0],r*a>r*e[o][0][1]?e[o][0][1]:a)[0],u}function a(){i=h.map(function(n){return n.map(function(n){var a,r=t(n[0][0],n[0][1])[0],e=t(n[2][0],n[2][1])[0],o=t(n[1][0],n[0][1])[1],i=t(n[1][0],n[1][1])[1];return o>i&&(a=o,o=i,i=a),[[r,o],[e,i]]})})}function r(){for(var t=1e-6,n=[],a=0,r=h[0].length;r>a;++a){var o=h[0][a],i=180*o[0][0]/fa,u=180*o[0][1]/fa,M=180*o[1][1]/fa,s=180*o[2][0]/fa,c=180*o[2][1]/fa;n.push(e([[i+t,u+t],[i+t,M-t],[s-t,M-t],[s-t,c+t]],30))}for(var a=h[1].length-1;a>=0;--a){var o=h[1][a],i=180*o[0][0]/fa,u=180*o[0][1]/fa,M=180*o[1][1]/fa,s=180*o[2][0]/fa,c=180*o[2][1]/fa;n.push(e([[s-t,c-t],[s-t,M+t],[i+t,M+t],[i+t,u-t]],30))}return{type:"Polygon",coordinates:[d3.merge(n)]}}function e(t,n){for(var a,r,e,o=-1,i=t.length,h=t[0],u=[];++o<i;){a=t[o],r=(a[0]-h[0])/n,e=(a[1]-h[1])/n;for(var M=0;n>M;++M)u.push([h[0]+M*r,h[1]+M*e]);h=a}return u.push(a),u}function o(t,n){return Math.abs(t[0]-n[0])<sa&&Math.abs(t[1]-n[1])<sa}var i,h=[[[[-fa,0],[0,va],[fa,0]]],[[[-fa,0],[0,-va],[fa,0]]]];t.invert&&(n.invert=function(a,r){for(var e=i[+(0>r)],u=h[+(0>r)],M=0,s=e.length;s>M;++M){var c=e[M];if(c[0][0]<=a&&a<c[1][0]&&c[0][1]<=r&&r<c[1][1]){var f=t.invert(a-t(u[M][1][0],0)[0],r);return f[0]+=u[M][1][0],o(n(f[0],f[1]),[a,r])?f:null}}});var u=d3.geo.projection(n),M=u.stream;return u.stream=function(t){var n=u.rotate(),a=M(t),e=(u.rotate([0,0]),M(t));return u.rotate(n),a.sphere=function(){d3.geo.stream(r(),e)},a},u.lobes=function(t){return arguments.length?(h=t.map(function(t){return t.map(function(t){return[[t[0][0]*fa/180,t[0][1]*fa/180],[t[1][0]*fa/180,t[1][1]*fa/180],[t[2][0]*fa/180,t[2][1]*fa/180]]})}),a(),u):h.map(function(t){return t.map(function(t){return[[180*t[0][0]/fa,180*t[0][1]/fa],[180*t[1][0]/fa,180*t[1][1]/fa],[180*t[2][0]/fa,180*t[2][1]/fa]]})})},u},(d3.geo.airy=c).raw=s,f.invert=function(t,n){if(!(t*t+4*n*n>fa*fa+sa)){var a=t,r=n,e=25;do{var o,i=Math.sin(a),h=Math.sin(a/2),M=Math.cos(a/2),s=Math.sin(r),c=Math.cos(r),f=Math.sin(2*r),v=s*s,l=c*c,g=h*h,d=1-l*M*M,b=d?u(c*M)*Math.sqrt(o=1/d):o=0,p=2*b*c*h-t,w=b*s-n,q=o*(l*g+b*c*M*v),m=o*(.5*i*f-2*b*s*h),y=.25*o*(f*h-b*s*l*i),S=o*(v*M+b*g*c),Q=m*y-S*q;if(!Q)break;var R=(w*m-p*S)/Q,T=(p*y-w*q)/Q;a-=R,r-=T}while((Math.abs(R)>sa||Math.abs(T)>sa)&&--e>0);return[a,r]}},(d3.geo.aitoff=function(){return ba(f)}).raw=f,(d3.geo.armadillo=l).raw=v,q.invert=function(t,n){if(t*=3/8,n*=3/8,!t&&Math.abs(n)>1)return null;var a=t*t,r=n*n,e=1+a+r,o=Math.sqrt(.5*(e-Math.sqrt(e*e-4*n*n))),u=h(o)/3,M=o?w(Math.abs(n/o))/3:p(Math.abs(t))/3,s=Math.cos(u),c=b(M),f=c*c-s*s;return[2*i(t)*Math.atan2(d(M)*s,.25-f),2*i(n)*Math.atan2(c*Math.sin(u),.25+f)]},(d3.geo.august=function(){return ba(q)}).raw=q;var wa=Math.log(1+Math.SQRT2);m.invert=function(t,n){if((r=Math.abs(n))<wa)return[t,2*Math.atan(Math.exp(n))-va];var a,r,e=Math.sqrt(8),o=fa/4,h=25;do{var u=Math.cos(o/2),M=Math.tan(o/2);o-=a=(e*(o-fa/4)-Math.log(M)-r)/(e-.5*u*u/M)}while(Math.abs(a)>ca&&--h>0);return[t/(Math.cos(o)*(e-1/Math.sin(o))),i(n)*o]},(d3.geo.baker=function(){return ba(m)}).raw=m;var qa=d3.geo.azimuthalEquidistant.raw;(d3.geo.berghaus=S).raw=y;var ma=Q(fa),ya=R(Math.SQRT2/va,Math.SQRT2,fa);(d3.geo.mollweide=function(){return ba(ya)}).raw=ya,T.invert=function(t,n){var a,r,e=2.00276,o=e*n,i=0>n?-fa/4:fa/4,h=25;do r=o-Math.SQRT2*Math.sin(i),i-=a=(Math.sin(2*i)+2*i-fa*Math.sin(r))/(2*Math.cos(2*i)+2+fa*Math.cos(r)*Math.SQRT2*Math.cos(i));while(Math.abs(a)>sa&&--h>0);return r=o-Math.SQRT2*Math.sin(i),[t*(1/Math.cos(r)+1.11072/Math.cos(i))/e,r]},(d3.geo.boggs=function(){return ba(T)}).raw=T,E.invert=function(t,n){return[t/Math.cos(n),n]},(d3.geo.sinusoidal=function(){return ba(E)}).raw=E,(d3.geo.bonne=function(){return x(P).parallel(45)}).raw=P;var Sa=R(1,4/fa,fa);(d3.geo.bromley=function(){return ba(Sa)}).raw=Sa,(d3.geo.chamberlin=_).raw=k,G.invert=function(t,n){var a=(a=n/la-1)*a;return[a>0?t*Math.sqrt(fa/a)/2:0,h(1-a)]},(d3.geo.collignon=function(){return ba(G)}).raw=G,(d3.geo.craig=function(){return x(j)}).raw=j,C.invert=function(t,n){var a=Math.sqrt(3),r=3*h(n/(a*la));return[la*t/(a*(2*Math.cos(2*r/3)-1)),r]},(d3.geo.craster=function(){return ba(C)}).raw=C,(d3.geo.cylindricalEqualArea=function(){return x(D)}).raw=D,(d3.geo.cylindricalStereographic=function(){return x(L)}).raw=L,O.invert=function(t,n){var a=Math.sqrt(8/(3*fa)),r=n/a;return[t/(a*(1-Math.abs(r)/fa)),r]},(d3.geo.eckert1=function(){return ba(O)}).raw=O,H.invert=function(t,n){var a=2-Math.abs(n)/Math.sqrt(2*fa/3);return[t*Math.sqrt(6*fa)/(2*a),i(n)*h((4-a*a)/3)]},(d3.geo.eckert2=function(){return ba(H)}).raw=H,I.invert=function(t,n){var a=Math.sqrt(fa*(4+fa))/2;return[t*a/(1+M(1-n*n*(4+fa)/(4*fa))),n*a/2]},(d3.geo.eckert3=function(){return ba(I)}).raw=I,J.invert=function(t,n){var a=.5*n*Math.sqrt((4+fa)/fa),r=h(a),e=Math.cos(r);return[t/(2/Math.sqrt(fa*(4+fa))*(1+e)),h((r+a*(e+2))/(2+va))]
    },(d3.geo.eckert4=function(){return ba(J)}).raw=J,K.invert=function(t,n){var a=Math.sqrt(2+fa),r=n*a/2;return[a*t/(1+Math.cos(r)),r]},(d3.geo.eckert5=function(){return ba(K)}).raw=K,N.invert=function(t,n){var a=1+va,r=Math.sqrt(a/2);return[2*t*r/(1+Math.cos(n*=r)),h((n+Math.sin(n))/a)]},(d3.geo.eckert6=function(){return ba(N)}).raw=N,U.invert=function(t,n){var a=d3.geo.august.raw.invert(t/1.2,1.065*n);if(!a)return null;var r=a[0],e=a[1],o=20;t/=Qa,n/=Qa;do{var i=r/2,h=e/2,u=Math.sin(i),M=Math.cos(i),s=Math.sin(h),c=Math.cos(h),f=Math.cos(e),v=Math.sqrt(f),l=s/(c+Math.SQRT2*M*v),g=l*l,d=Math.sqrt(2/(1+g)),b=Math.SQRT2*c+(M+u)*v,p=Math.SQRT2*c+(M-u)*v,w=b/p,q=Math.sqrt(w),m=q-1/q,y=q+1/q,S=d*m-2*Math.log(q)-t,Q=d*l*y-2*Math.atan(l)-n,R=s&&Math.SQRT1_2*v*u*g/s,T=(Math.SQRT2*M*c+v)/(2*(c+Math.SQRT2*M*v)*(c+Math.SQRT2*M*v)*v),x=-.5*l*d*d*d,E=x*R,P=x*T,k=(k=2*c+Math.SQRT2*v*(M-u))*k*q,_=(Math.SQRT2*M*c*v+f)/k,z=-(Math.SQRT2*u*s)/(v*k),B=m*E-2*_/q+d*(_+_/w),F=m*P-2*z/q+d*(z+z/w),A=l*y*E-2*R/(1+g)+d*y*R+d*l*(_-_/w),G=l*y*P-2*T/(1+g)+d*y*T+d*l*(z-z/w),j=F*A-G*B;if(!j)break;var C=(Q*F-S*G)/j,D=(S*A-Q*B)/j;r-=C,e=Math.max(-va,Math.min(va,e-D))}while((Math.abs(C)>sa||Math.abs(D)>sa)&&--o>0);return Math.abs(Math.abs(e)-va)<sa?[0,e]:o&&[r,e]};var Qa=3+2*Math.SQRT2;(d3.geo.eisenlohr=function(){return ba(U)}).raw=U,V.invert=function(t,n){var a=n/(1+Ra);return[t?t/(Ra*M(1-a*a)):0,2*Math.atan(a)]};var Ra=Math.cos(35*ga);(d3.geo.fahey=function(){return ba(V)}).raw=V,W.invert=function(t,n){var a=Math.atan(n/la),r=Math.cos(a),e=2*a;return[t*la*.5/(Math.cos(e)*r*r),e]},(d3.geo.foucaut=function(){return ba(W)}).raw=W,d3.geo.gilbert=function(t){function n(n){return t([.5*n[0],h(Math.tan(.5*n[1]*ga))*da])}var a=d3.geo.equirectangular().scale(da).translate([0,0]);return t.invert&&(n.invert=function(n){return n=t.invert(n),n[0]*=2,n[1]=2*Math.atan(Math.sin(n[1]*ga))*da,n}),n.stream=function(n){n=t.stream(n);var r=a.stream({point:function(t,a){n.point(.5*t,h(Math.tan(.5*-a*ga))*da)},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}});return r.sphere=function(){n.sphere()},r.valid=!1,r},n};var Ta=X(2.8284,-1.6988,.75432,-.18071,1.76003,-.38914,.042555);(d3.geo.ginzburg4=function(){return ba(Ta)}).raw=Ta;var xa=X(2.583819,-.835827,.170354,-.038094,1.543313,-.411435,.082742);(d3.geo.ginzburg5=function(){return ba(xa)}).raw=xa;var Ea=X(5/6*fa,-.62636,-.0344,0,1.3493,-.05524,0,.045);(d3.geo.ginzburg6=function(){return ba(Ea)}).raw=Ea,Y.invert=function(t,n){var a,r=t,e=n,o=50;do{var i=e*e;e-=a=(e*(1+i/12)-n)/(1+i/4)}while(Math.abs(a)>sa&&--o>0);o=50,t/=1-.162388*i;do{var h=(h=r*r)*h;r-=a=(r*(.87-952426e-9*h)-t)/(.87-.00476213*h)}while(Math.abs(a)>sa&&--o>0);return[r,e]},(d3.geo.ginzburg8=function(){return ba(Y)}).raw=Y;var Pa=X(2.6516,-.76534,.19123,-.047094,1.36289,-.13965,.031762);(d3.geo.ginzburg9=function(){return ba(Pa)}).raw=Pa,$.invert=function(t,n){var a=i(t),r=i(n),e=-a*t,o=-r*n,u=1>o/e,M=nn(u?o:e,u?e:o),s=M[0],c=M[1];u&&(s=-va-s);var f=Math.cos(c),t=Math.cos(s)*f,n=Math.sin(s)*f,v=Math.sin(c);return[a*(Math.atan2(n,-v)+fa),r*h(t)]},d3.geo.gringorten=Z($),hn.invert=function(t,n){var a=(Math.SQRT2-1)/(Math.SQRT2+1),r=Math.sqrt(1-a*a),e=on(va,r*r),o=-1,i=an(.5*e-n,-t,r*r),h=Mn(i[0],i[1]),u=Math.atan2(h[1],h[0])/o;return[u,2*Math.atan(Math.exp(.5/o*Math.log(a*h[0]*h[0]+a*h[1]*h[1])))-va]},d3.geo.guyou=Z(hn),(d3.geo.hammerRetroazimuthal=fn).raw=sn;var ka=d3.geo.azimuthalEqualArea.raw;gn.invert=function(t,n){var a=2*h(n/2);return[t*Math.cos(a/2)/Math.cos(a),a]},(d3.geo.hammer=ln).raw=vn,dn.invert=function(t,n){var a=Math.abs(a=n*(0>n?.5179951515653813:.5686373742600607))>1-sa?a>0?va:-va:h(a);return[1.1764705882352942*t/Math.cos(a),Math.abs(a=((a+=a)+Math.sin(a))*(0>n?.4102345310814193:.3736990601468637))>1-sa?a>0?va:-va:h(a)]},(d3.geo.hatano=function(){return ba(dn)}).raw=dn;var _a=41+48/36+37/3600;(d3.geo.healpix=pn).raw=bn,(d3.geo.hill=qn).raw=wn;var za=.7109889596207567,Ba=.0528035274542;mn.invert=function(t,n){return n>-za?ya.invert(t,n-Ba):E.invert(t,n)},(d3.geo.sinuMollweide=function(){return ba(mn).rotate([-20,-55])}).raw=mn,yn.invert=function(t,n){return Math.abs(n)>za?ya.invert(t,n+(n>0?Ba:-Ba)):E.invert(t,n)},(d3.geo.homolosine=function(){return ba(yn)}).raw=yn,Sn.invert=function(t,n){return[2/3*fa*t/Math.sqrt(fa*fa/3-n*n),n]},(d3.geo.kavrayskiy7=function(){return ba(Sn)}).raw=Sn,(d3.geo.lagrange=Rn).raw=Qn,Tn.invert=function(t,n){var a=Math.abs(t),r=Math.abs(n),e=fa/Math.SQRT2,o=sa,i=va;e>r?i*=r/e:o+=6*u(e/r);for(var h=0;25>h;h++){var s=Math.sin(i),c=M(Math.cos(i)),f=Math.sin(i/2),v=Math.cos(i/2),l=Math.sin(o/6),g=Math.cos(o/6),d=.5*o*(1+c)-a,b=i/(v*g)-r,p=c?-.25*o*s/c:0,w=.5*(1+c),q=(1+.5*i*f/v)/(v*g),m=i/v*(l/6)/(g*g),y=p*m-q*w,S=(d*m-b*w)/y,Q=(b*p-d*q)/y;if(i-=S,o-=Q,Math.abs(S)<sa&&Math.abs(Q)<sa)break}return[0>t?-o:o,0>n?-i:i]},(d3.geo.larrivee=function(){return ba(Tn)}).raw=Tn,xn.invert=function(t,n){var a=i(t)*fa,r=n/2,e=50;do{var o=a*a,h=r*r,u=a*r,M=a*(.975534+h*(-.119161+o*-.0143059+h*-.0547009))-t,s=r*(1.00384+o*(.0802894+h*-.02855+199025e-9*o)+h*(.0998909+h*-.0491032))-n,c=.975534-h*(.119161+3*o*.0143059+.0547009*h),f=-u*(.238322+.2188036*h+.0286118*o),v=u*(.1605788+7961e-7*o+-0.0571*h),l=1.00384+o*(.0802894+199025e-9*o)+h*(3*(.0998909-.02855*o)-.245516*h),g=f*v-l*c,d=(s*f-M*l)/g,b=(M*v-s*c)/g;a-=d,r-=b}while((Math.abs(d)>sa||Math.abs(b)>sa)&&--e>0);return e&&[a,r]},(d3.geo.laskowski=function(){return ba(xn)}).raw=xn,En.invert=function(t,n){var a=t*t,r=n*n,e=r+1,o=t?Math.SQRT1_2*Math.sqrt((e-Math.sqrt(a*a+2*a*(r-1)+e*e))/a+1):1/Math.sqrt(e);return[h(t*o),i(n)*u(o)]},(d3.geo.littrow=function(){return ba(En)}).raw=En,(d3.geo.loximuthal=function(){return x(Pn).parallel(40)}).raw=Pn,kn.invert=function(t,n){return[t,2.5*Math.atan(Math.exp(.8*n))-.625*fa]},(d3.geo.miller=function(){return ba(kn)}).raw=kn;var Fa={alaska:[[.9972523,0],[.0052513,-.0041175],[.0074606,.0048125],[-.0153783,-.1968253],[.0636871,-.1408027],[.3660976,-.2937382]],gs48:[[.98879,0],[0,0],[-.050909,0],[0,0],[.075528,0]],gs50:[[.984299,0],[.0211642,.0037608],[-.1036018,-.0575102],[-.0329095,-.0320119],[.0499471,.1223335],[.026046,.0899805],[7388e-7,-.1435792],[.0075848,-.1334108],[-.0216473,.0776645],[-.0225161,.0853673]],miller:[[.9245,0],[0,0],[.01943,0]],lee:[[.721316,0],[0,0],[-.00881625,-.00617325]]};(d3.geo.modifiedStereographic=zn).raw=_n,Bn.invert=function(t,n){var a=Math.sqrt(6),r=Math.sqrt(7),e=3*h(n*r/9);return[t*r/(a*(2*Math.cos(2*e/3)-1)),h(3*Math.sin(e)*a/7)]},(d3.geo.mtFlatPolarParabolic=function(){return ba(Bn)}).raw=Bn,Fn.invert=function(t,n){var a=n*Math.sqrt(2+Math.SQRT2)/(2*Math.sqrt(3)),r=2*h(a);return[3*Math.SQRT2*t/(1+2*Math.cos(r)/Math.cos(r/2)),h((a+Math.sin(r))/(1+Math.SQRT1_2))]},(d3.geo.mtFlatPolarQuartic=function(){return ba(Fn)}).raw=Fn,An.invert=function(t,n){var a=Math.sqrt(6/(4+fa)),r=n/a;return Math.abs(Math.abs(r)-va)<sa&&(r=0>r?-va:va),[1.5*t/(a*(.5+Math.cos(r))),h((r/2+Math.sin(r))/(1+fa/4))]},(d3.geo.mtFlatPolarSinusoidal=function(){return ba(An)}).raw=An,Gn.invert=function(t,n){var a,r=n,e=25;do{var o=r*r,i=o*o;r-=a=(r*(1.007226+o*(.015085+i*(-.044475+.028874*o-.005916*i)))-n)/(1.007226+o*(.045255+i*(-0.311325+.259866*o-.005916*11*i)))}while(Math.abs(a)>sa&&--e>0);return[t/(.8707+(o=r*r)*(-.131979+o*(-.013791+o*o*o*(.003971-.001529*o)))),r]},(d3.geo.naturalEarth=function(){return ba(Gn)}).raw=Gn,jn.invert=function(t,n){for(var a=n/2,r=0,e=1/0;10>r&&Math.abs(e)>sa;r++){var o=Math.cos(n/2);n-=e=(n-Math.tan(n/2)-a)/(1-.5/(o*o))}return[2*t/(1+Math.cos(n)),n]},(d3.geo.nellHammer=function(){return ba(jn)}).raw=jn;var Aa=Z(hn);(d3.geo.peirceQuincuncial=function(){return Aa().quincuncial(!0).rotate([-90,-90,45]).clipAngle(180-1e-6)}).raw=Aa.raw,Cn.invert=function(t,n){if(Math.abs(n)<sa)return[t,0];var a,r=t*t+n*n,e=.5*n,o=10;do{var M=Math.tan(e),s=1/Math.cos(e),c=r-2*n*e+e*e;e-=a=(M*c+2*(e-n))/(2+c*s*s+2*(e-n)*M)}while(Math.abs(a)>sa&&--o>0);return M=Math.tan(e),[(Math.abs(n)<Math.abs(e+1/M)?h(t*M):i(t)*(u(Math.abs(t*M))+va))/Math.sin(e),e]},(d3.geo.polyconic=function(){return ba(Cn)}).raw=Cn,(d3.geo.rectangularPolyconic=function(){return x(Dn)}).raw=Dn;var Ga=[[.9986,-.062],[1,0],[.9986,.062],[.9954,.124],[.99,.186],[.9822,.248],[.973,.31],[.96,.372],[.9427,.434],[.9216,.4958],[.8962,.5571],[.8679,.6176],[.835,.6769],[.7986,.7346],[.7597,.7903],[.7186,.8435],[.6732,.8936],[.6213,.9394],[.5722,.9761],[.5322,1]];Ga.forEach(function(t){t[1]*=1.0144}),Ln.invert=function(t,n){var a=n/va,r=90*a,e=Math.min(18,Math.abs(r/5)),o=Math.max(0,Math.floor(e));do{var i=Ga[o][1],h=Ga[o+1][1],u=Ga[Math.min(19,o+2)][1],M=u-i,s=u-2*h+i,c=2*(Math.abs(a)-h)/M,f=s/M,v=c*(1-f*c*(1-2*f*c));if(v>=0||1===o){r=(n>=0?5:-5)*(v+e);var l,g=50;do e=Math.min(18,Math.abs(r)/5),o=Math.floor(e),v=e-o,i=Ga[o][1],h=Ga[o+1][1],u=Ga[Math.min(19,o+2)][1],r-=(l=(n>=0?va:-va)*(h+v*(u-i)/2+v*v*(u-2*h+i)/2)-n)*da;while(Math.abs(l)>ca&&--g>0);break}}while(--o>=0);var d=Ga[o][0],b=Ga[o+1][0],p=Ga[Math.min(19,o+2)][0];return[t/(b+v*(p-d)/2+v*v*(p-2*b+d)/2),r*ga]},(d3.geo.robinson=function(){return ba(Ln)}).raw=Ln,(d3.geo.satellite=In).raw=Hn,Jn.invert=function(t,n){var a=n/1.70711,r=Math.sin(fa/4*a);return[t/(.74482-.34588*r*r),2*Math.atan(a)]},(d3.geo.times=function(){return ba(Jn)}).raw=Jn,(d3.geo.twoPointEquidistant=Nn).raw=Kn,(d3.geo.twoPointAzimuthal=Vn).raw=Un,Wn.invert=function(t,n){if(Math.abs(n)<sa)return[t,0];if(Math.abs(t)<sa)return[0,va*Math.sin(2*Math.atan(n/fa))];var a=(t/=fa)*t,r=(n/=fa)*n,e=a+r,o=e*e,h=-Math.abs(n)*(1+e),M=h-2*r+a,s=-2*h+1+2*r+o,c=r/s+(2*M*M*M/(s*s*s)-9*h*M/(s*s))/27,f=(h-M*M/(3*s))/s,v=2*Math.sqrt(-f/3),l=u(3*c/(f*v))/3;return[fa*(e-1+Math.sqrt(1+2*(a-r)+o))/(2*t),i(n)*fa*(-v*Math.cos(l+fa/3)-M/(3*s))]},(d3.geo.vanDerGrinten=function(){return ba(Wn)}).raw=Wn,Xn.invert=function(t,n){if(!t)return[0,va*Math.sin(2*Math.atan(n/fa))];var a=Math.abs(t/fa),r=(1-a*a-(n/=fa)*n)/(2*a),e=r*r,o=Math.sqrt(e+1);return[i(t)*fa*(o-r),i(n)*va*Math.sin(2*Math.atan2(Math.sqrt((1-2*r*a)*(r+o)-a),Math.sqrt(o+r+a)))]},(d3.geo.vanDerGrinten2=function(){return ba(Xn)}).raw=Xn,Yn.invert=function(t,n){if(!n)return[t,0];var a=n/fa,r=(fa*fa*(1-a*a)-t*t)/(2*fa*t);return[t?fa*(i(t)*Math.sqrt(r*r+1)-r):0,va*Math.sin(2*Math.atan(a))]},(d3.geo.vanDerGrinten3=function(){return ba(Yn)}).raw=Yn,Zn.invert=function(t,n){if(!t||!n)return[t,n];n/=fa;var a=i(t)*t/va,r=(a*a-1+4*n*n)/Math.abs(a),e=r*r,o=2*n,h=50;do{var u=o*o,M=(8*o-u*(u+2)-5)/(2*u*(o-1)),s=(3*o-u*o-10)/(2*u*o),c=M*M,f=o*M,v=o+M,l=v*v,g=o+3*M,d=l*(u+c*e-1)+(1-u)*(u*(g*g+4*c)+c*(12*f+4*c)),b=-2*v*(4*f*c+(1-4*u+3*u*u)*(1+s)+c*(-6+14*u-e+(-8+8*u-2*e)*s)+f*(-8+12*u+(-10+10*u-e)*s)),p=Math.sqrt(d),w=r*(l+c-1)+2*p-a*(4*l+e),q=r*(2*M*s+2*v*(1+s))+b/p-8*v*(r*(-1+c+l)+2*p)*(1+s)/(e+4*l);o-=δ=w/q}while(δ>sa&&--h>0);return[i(t)*(Math.sqrt(r*r+4)+r)*fa/4,va*o]},(d3.geo.vanDerGrinten4=function(){return ba(Zn)}).raw=Zn;var ja=function(){var t=4*fa+3*Math.sqrt(3),n=2*Math.sqrt(2*fa*Math.sqrt(3)/t);return R(n*Math.sqrt(3)/fa,n,t/6)}();(d3.geo.wagner4=function(){return ba(ja)}).raw=ja,$n.invert=function(t,n){return[t/Math.sqrt(1-3*n*n/(fa*fa)),n]},(d3.geo.wagner6=function(){return ba($n)}).raw=$n,ta.invert=function(t,n){var a=t/2.66723,r=n/1.24104,e=Math.sqrt(a*a+r*r),o=2*h(e/2);return[3*Math.atan2(t*Math.tan(o),2.66723*e),e&&h(n*Math.sin(o)/(1.24104*.90631*e))]},(d3.geo.wagner7=function(){return ba(ta)}).raw=ta,na.invert=function(t,n){var a=-.5*(t*t+n*n),r=Math.sqrt(-a*(2+a)),e=n*a+t*r,o=t*a-n*r,i=Math.sqrt(o*o+e*e);return[Math.atan2(r*e,i*(1+a)),i?-h(r*o/i):0]},(d3.geo.wiechel=function(){return ba(na)}).raw=na,aa.invert=function(t,n){var a=t,r=n,e=25;do{var o,i=Math.cos(r),h=Math.sin(r),M=Math.sin(2*r),s=h*h,c=i*i,f=Math.sin(a),v=Math.cos(a/2),l=Math.sin(a/2),g=l*l,d=1-c*v*v,b=d?u(i*v)*Math.sqrt(o=1/d):o=0,p=.5*(2*b*i*l+a/va)-t,w=.5*(b*h+r)-n,q=.5*o*(c*g+b*i*v*s)+.5/va,m=o*(f*M/4-b*h*l),y=.125*o*(M*l-b*h*c*f),S=.5*o*(s*v+b*g*i)+.5,Q=m*y-S*q,R=(w*m-p*S)/Q,T=(p*y-w*q)/Q;a-=R,r-=T}while((Math.abs(R)>sa||Math.abs(T)>sa)&&--e>0);return[a,r]},(d3.geo.winkel3=function(){return ba(aa)}).raw=aa}();
    var _projectionType = d3.geo.miller();
    _chart = sizeBoxifyMixin(_chart);


    _chart.adjustedHeight = function() {
      return _chart.getDynamicWidth()/PROJECTION_RATIO;
    };


    _chart.projectionTopOffsetModifier = function(_) {
      // {medium: For740orLess, large: ForGreaterThan740}
      if(!arguments.length) return _projectionTopOffsetModifier;
      _projectionTopOffsetModifier = _;
      return _chart;
    };

    _chart.projectionTopOffset = function(_) {

      if(_chart.getDynamicWidth() < 740) {
        return _chart.adjustedHeight()/_projectionTopOffsetModifier.medium;
      }
      else {
        return _chart.adjustedHeight()/_projectionTopOffsetModifier.large;
      } 

      return _chart;
    };

    _chart.projectionLeftOffsetModifier = function(_) {
      // {medium: For740orLess, large: ForGreaterThan740}
      if(!arguments.length) return _projectionLeftOffsetModifier;
      _projectionLeftOffsetModifier = _;
      return _chart;
    };

    _chart.projectionLeftOffset = function() {

      if(_chart.getDynamicWidth() < 740) {
        return _chart.getDynamicWidth()/_projectionLeftOffsetModifier.medium;
      }
      else {
        return _chart.getDynamicWidth()/_projectionLeftOffsetModifier.large;
      }

      return _chart;
    };


    _chart.getProjectionScale = function() {
      return (_chart.getDynamicWidth()/PROJECTION_WIDTH) * _originalScale;
    };

    _chart.originalScale = function(_) {
      if(!arguments.length) return _originalScale;
      _originalScale = _;
      return _chart;
    };

    _chart.getTranslatedProjection = function() {
      return _projectionType.scale(_chart.getProjectionScale()).translate([_chart.getDynamicWidth()/2 - _chart.projectionLeftOffset(), _chart.getDynamicHeight()/2 + _chart.projectionTopOffset()]);
    };

    _chart.projectionType = function(_) {
      if(!arguments.length) return _projectionType;
      _projectionType = _;
      _chart.projection(_chart.getTranslatedProjection());
      return _chart;
    };

    _chart.resize = function() {
      _chart.width(_chart.getDynamicWidth())
        .height(_chart.adjustedHeight())
        .projection(_chart.getTranslatedProjection());

      _chart.sbxPreRender()(_chart);
      _chart.render();
    };


    _chart.width(_chart.getDynamicWidth()).height(_chart.adjustedHeight());
    _chart.sbxPreRender()(_chart);
    return _chart;
  };

  //Set this to false if the resize needs to be triggered manually
  dc.autoResize = function(_) {
    if(!arguments.length) return _autoResize;
    _autoResize = _;
    return dc;
  }

  //Trigger the 'resize:qd' event
  //Can be used to trigger resize in the parent application
  dc.triggerQDResize = function() {
    window.dispatchEvent(qdResize);
  };

  //resize qd components on 'resize' if dc.autoResize() is true
  window.addEventListener('resize', function() {if(dc.autoResize() === true) dc.triggerQDResize();})

  return dc;
};

var sizeBoxifyMixin = function(chart) {

  var container = chart.root()[0][0];
  chart.root().classed('size-boxified', true);
  var _sbxPreRenderFunc = function(chart) {};

  chart.getDynamicHeight = function() {
      return container.offsetHeight;
    };

  chart.getDynamicWidth = function() {
    return container.offsetWidth;
  };

  //do anything required after size calculations are made, but before render
  chart.sbxPreRender = function(_) {
    if(!arguments.length) return _sbxPreRenderFunc;
    _sbxPreRenderFunc = _;
    return chart;
  };

  //add a custom listener to window that all qd components will use
  window.addEventListener('resize:qd', chart.resize, true);

  //Special case: detect parent element size change that doesn't trigger resize event
  //This can happen when the scrollbar appears 
  detectElementResize.addResizeListener(container, checkForResize);
  function checkForResize() {
    if(chart.getDynamicWidth() > chart.width() || chart.getDynamicWidth < chart.width()) {
      chart.resize();
    }
  }

  return chart;
}

module.exports = sizeBoxify;



