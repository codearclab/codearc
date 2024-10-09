/*!
 * Codearc  v1.0.0 (https://getcodearc.vercel.app)
 * Copyright 2024-2024 The Codearc Authors
 * Licensed under MIT (https://github.com/codearclab/codearc/LICENSE)
*/

/** Copy To Clipboard **/
function clipboard(id){
  let ie = document.createElement("input");
  ie.type = "text";
  let copyText = document.getElementById(id).innerHTML;
  ie.value = copyText;
  document.body.appendChild(ie);
  ie.select();
  document.execCommand('copy');
  document.body.removeChild(ie);
  /** Common Alert Message **/
  document.getElementById("clipboardAlert").style.display = "block";
  setTimeout(function() {
    document.getElementById("clipboardAlert").style.display = "none";
  }, 1000);
}

/** Pause **/
const pause = (callback, timeout = 0) => {
  if (typeof callback !== 'function') return;
  return window.setTimeout(callback, timeout);
};

/** Offcanvas **/
(function(root, factory){
  if(typeof define === 'function' && define.amd){
    define([], factory);
  }else if(typeof module === 'object' && module.exports){
    module.exports = factory();
  }else{
    root.offcanvas = factory();
  }
}(this, function(){
  'use strict';
  function testPassive(){
    var supportsPassive = false;
    try{
      var options = Object.defineProperty({}, 'passive',{
        get: function(){
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', null, options);
      window.removeEventListener('testPassive', null, options);
    }catch (e){}
    return supportsPassive;
  }
  function getScrollbarSize(){
    var scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    var scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarSize;
  }
  var supportsPassive = testPassive();
  var scrollbarSize = getScrollbarSize();
  var offcanvas = function(element, options){
    var panel = typeof element === 'string' ? document.querySelector(element) : element;
    if(! panel) return false;
    var html = document.documentElement;
    var blockerElement = document.getElementsByClassName('offcanvas-blocker')[0];
    var closeElement = panel.querySelector('[data-close]');
    var panelContent = panel.querySelector('.offcanvas-content');
    var settings = {
      closeOnEsc: true,
      closeOnClick: true,
      disableOverscroll: true,
      disableBodyscroll: false,
      activeClass: 'offcanvas-active',
      onOpen: function() {},
      onClose: function() {}
    };
    for(var key in options){
      if (settings.hasOwnProperty(key)){
        settings[key] = options[key];
      }
    }
    var api = {
      isOpen: false,
      open: function(e){
        if (! api.isOpen){
          api.isOpen = true;
          panel.classList.add('panel-active');
          html.classList.add(settings.activeClass);
          if (document.body.scrollHeight > window.innerHeight) {
            html.style.paddingRight = scrollbarSize + 'px';
            Array.prototype.forEach.call(document.getElementsByClassName('offcanvas-push'), function(el) {
              el.style.paddingRight = scrollbarSize + 'px';
            });
          }
          if(e){
            api.activeElement = e.currentTarget;
            api.activeElement.setAttribute('aria-expanded', true);
          }
          panel.setAttribute('aria-hidden', false);
          panelContent.focus();
          settings.onOpen(panel);
        }
      },
      close: function(e) {
        if (api.isOpen) {
          api.isOpen = false;
          panel.classList.remove('panel-active');
          html.classList.remove(settings.activeClass);
          html.style.paddingRight = '';
          Array.prototype.forEach.call(document.getElementsByClassName('offcanvas-push'), function(el) {
            el.style.paddingRight = '';
          });
          if (api.activeElement) {
            api.activeElement.setAttribute('aria-expanded', false);
            api.activeElement.focus();
          }
          panel.setAttribute('aria-hidden', true);
          settings.onClose(panel);
        }
      },
      toggle: function(e) {
        if (api.isOpen) {
          api.close(e);
        } else {
          api.open(e);
        }
      },
      disableOverscroll: function(el) {
        el.addEventListener('touchstart', function() {
          if (el.scrollTop === 0) {
            el.scrollTop = 1;
          } else if (el.scrollTop + el.offsetHeight === el.scrollHeight) {
            el.scrollTop = el.scrollTop - 1;
          }
        });
      },
      disableBodyscroll: function(el) {
        document.body.addEventListener('touchmove', function(e) {
          if (api.isOpen) {
            if (el.scrollHeight <= el.clientHeight) {
              e.preventDefault();
            }
          }
        }, supportsPassive ? { passive: false } : false);
      }
    };
    panel.addEventListener('transitionend', function(e) {
      if (e.propertyName == 'opacity') {
        if (api.isOpen) {
          html.classList.add('offcanvas-animated');
        } else {
          html.classList.remove('offcanvas-animated');
        }
      }
    });
    if(! (window.CSS && CSS.supports('overscroll-behavior', 'contain'))){
      if (settings.disableOverscroll){
        api.disableOverscroll(panelContent);
      }
      if (settings.disableBodyscroll){
        api.disableBodyscroll(panelContent);
      }
    }
    if (settings.closeOnEsc){
      document.addEventListener('keydown', function(e) {
        if (e.keyCode === 27) {
          api.close(e);
        }
      });
    }
    if (typeof blockerElement === 'undefined'){
      blockerElement = document.createElement('div');
      blockerElement.className = 'offcanvas-blocker';
      document.body.appendChild(blockerElement);
    }
    if (settings.closeOnClick){
      blockerElement.addEventListener('click', api.close);
    }
    if (closeElement){
      closeElement.addEventListener('click', api.close);
    }
    panelContent.setAttribute('tabindex', '-1');
    panel.offcanvas = api;

    return api;
  };
  return offcanvas;
}));
