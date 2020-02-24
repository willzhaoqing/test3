(function () {
  'use strict';
  /**
   * Converts details/summary tags into working elements in browsers that don't yet support them.
   * @return {void}
   */
  var details = (function () {

    var isDetailsSupported = function () {
      // https://mathiasbynens.be/notes/html5-details-jquery#comment-35
      // Detect if details is supported in the browser
      var el = document.createElement("details");
      var fake = false;

      if (!("open" in el)) {
        return false;
      }

      var root = document.body || function () {
        var de = document.documentElement;
        fake = true;
        return de.insertBefore(document.createElement("body"), de.firstElementChild || de.firstChild);
      }();

      el.innerHTML = "<summary>a</summary>b";
      el.style.display = "block";
      root.appendChild(el);
      var diff = el.offsetHeight;
      el.open = true;
      diff = diff !== el.offsetHeight;
      root.removeChild(el);

      if (fake) {
        root.parentNode.removeChild(root);
      }

      return diff;
    }();

    if (!isDetailsSupported) {
      var blocks = document.querySelectorAll("details>summary");
      for (var i = 0; i < blocks.length; i++) {
        var summary = blocks[i];
        var details = summary.parentNode;

        // Apply "no-details" to for unsupported details tags
        if (!details.className.match(new RegExp("(\\s|^)no-details(\\s|$)"))) {
          details.className += " no-details";
        }

        summary.addEventListener("click", function (e) {
          var node = e.target.parentNode;
          if (node.hasAttribute("open")) {
            node.removeAttribute("open");
          } else {
            node.setAttribute("open", "open");
          }
        });
      }
    }
  });

  (function () {
    var onReady = function onReady(fn) {
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", fn);
      } else {
        document.attachEvent("onreadystatechange", function () {
          if (document.readyState === "interactive") {
            fn();
          }
        });
      }
    };

    onReady(function () {
      details();
    });
  })();

}());



function getReminders() {
  var p = window.location.pathname;
  var md = p.slice(0, -5);//.split('/').slice(-1)[0].slice(0,-5);
  var reminders = Array.from(document.querySelectorAll(
    '.task-list-item .reminder '
  )).map(el => {
    if (!el.parentNode.childNodes[0].hasAttribute('checked')) {
      return {
        'filename': md,
        'text': el.parentNode.innerText,
        'time': el.parentNode.querySelector('label').innerText
      }
    }
  });
  getReturn(JSON.stringify(reminders))
}

//remove for now 
//var tocElem = document.querySelector(".toc");
//if (tocElem) {
//  tocElem.style.setProperty("height", window.innerHeight + 'px');
// window.addEventListener("resize", resizeThrottler, false);
//}

var resizeTimeout;
function resizeThrottler() {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(function () {
      resizeTimeout = null;
      actualResizeHandler();
    }, 300);
  }
}

function actualResizeHandler() {
  tocElem.style.setProperty("height", window.innerHeight + 'px');
}
class JsTable {
  constructor(header) {
    this.header = header;
    this.rows = [];
  }
  addRow(row) {
    this.rows.push(row);
  }
  getRow(i) {
    if (i < this.rows.length) {
      return this.rows[i];
    }
    return NaN
  }
  getValue(field, i) {
    var index = this.header.indexOf(field);
    var row = getRow(i);
    if (index < row.length) {
      return row[index]
    }
    return NaN
  }
}

function list_tables() {
  var tables = Array.from(
    document.querySelectorAll('table th:first-child')).map(el => { return el.innerText }
    );
  return tables;
}



function tables_fetch() {
  var tbNames = list_tables()
  var tables = {}
  for (itb in tbNames) {
    var name = tbNames[itb]
    tables[name] = table_fetch(name)
  }
  return tables
}


function getTableID(elTable) {
  return elTable.querySelector( 'th:first-child').innerHTML
}

function getTableByID(tableID) {
  var tables = Array.from(document.querySelectorAll('table th:first-child')).filter(el => { if (el.innerText ==  tableID) { return el.parentNode } });
  if (tables.length > 0) {
    if (tables[0].parentNode && tables[0].parentNode.parentNode 
        && tables[0].parentNode.parentNode.parentNode) {
      var table = tables[0].parentNode.parentNode.parentNode;
      return table
    }
  }
}

function table_fetch(first_row_name) {
  var tables = Array.from(document.querySelectorAll('table th:first-child')).filter(el => { if (el.innerText == first_row_name) { return el.parentNode } });
  if (tables.length > 0) {
    if (tables[0].parentNode && tables[0].parentNode.parentNode && tables[0].parentNode.parentNode.parentNode) {
      var table = tables[0].parentNode.parentNode.parentNode;
      var headers = Array.from(table.querySelectorAll('thead th')).map(el => { return el.innerText; })
      var tb = new JsTable(headers)
      var rows = table.querySelectorAll('tbody tr')
      var i;
      for (i = 0; i < rows.length; i++) {
        var row = rows[i];
        rowt = Array.from(row.querySelectorAll('td')).map(el => { return el.innerText })
        tb.addRow(rowt)
      }
      return {
        'header': tb.header,
        'rows': tb.rows
      }
    }
  }
  //return NaN
}

function c3_show(dom_id, data, type_) {
  if (type_ === 'line') {

  }
}
function createMutationObserverObject(fn) {
  var MutationObserver = window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;

  if (!MutationObserver) {
    py_alert('Not Support Observer')
    return false;
  }
  return new MutationObserver(function (mutations) {
    mutations.forEach(fn);
  });
}
function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    // 如果最后的节点是目标元素，则直接添加。因为默认是最后
    parent.appendChild(newElement);
  }
  else {
    parent.insertBefore(newElement, targetElement.nextSibling);
    //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
  }
}
var jsnamespace = window.jsnamespace || {};

jsnamespace['Pageniation'] = {
    firstPage(table_id) {    // 首页
        jsnamespace['Pageniation' + table_id].curPage = 1
        jsnamespace['Pageniation' + table_id].direct = 1
        jsnamespace['Pageniation'].displayPage(table_id);
    },
    frontPage(table_id) {    // 上一页
        jsnamespace['Pageniation' + table_id].direct = -1;
        jsnamespace['Pageniation'].displayPage(table_id);
    },
    nextPage(table_id) {    // 下一页
        jsnamespace['Pageniation' + table_id].direct = 1;
        jsnamespace['Pageniation'].displayPage(table_id);
    },
    lastPage(table_id) {    // 尾页
        jsnamespace['Pageniation' + table_id].curPage = jsnamespace['Pageniation' + table_id].page;
        jsnamespace['Pageniation' + table_id].direct = 0;
        jsnamespace['Pageniation'].displayPage(table_id);
    },
    setDisplay(row, flag) {
        if (row != null) {
            if (flag == false) { //do: "table-row"))
                row.style.display = "none";
            }
            else {
                row.style = "";
            }
        }
    },
    displayPage(table_id) {

        if (jsnamespace['Pageniation' + table_id].curPage <= 1 && jsnamespace['Pageniation' + table_id].direct == -1) {
            jsnamespace['Pageniation' + table_id].direct = 0;
            alert("已经是第一页了");
            return;
        } else if (jsnamespace['Pageniation' + table_id].curPage >= jsnamespace['Pageniation' + table_id].page && jsnamespace['Pageniation' + table_id].direct == 1) {
            jsnamespace['Pageniation' + table_id].direct = 0;
            alert("已经是最后一页了");
            return;
        }

        jsnamespace['Pageniation' + table_id].lastPage = jsnamespace['Pageniation' + table_id].curPage;

        // 修复当len=1时，curPage计算得0的bug
        if (jsnamespace['Pageniation' + table_id].len > jsnamespace['Pageniation' + table_id].pageSize) {
            jsnamespace['Pageniation' + table_id].curPage = ((jsnamespace['Pageniation' + table_id].curPage + jsnamespace['Pageniation' + table_id].direct + jsnamespace['Pageniation' + table_id].len) % jsnamespace['Pageniation' + table_id].len);
        } else {
            jsnamespace['Pageniation' + table_id].curPage = 1;
        }


        document.getElementById(`${table_id}btn0`).innerHTML = "当前 " + jsnamespace['Pageniation' + table_id].curPage + "/" + jsnamespace['Pageniation' + table_id].page + " 页    每页 ";        // 显示当前多少页

        jsnamespace['Pageniation' + table_id].begin = (jsnamespace['Pageniation' + table_id].curPage - 1) * jsnamespace['Pageniation' + table_id].pageSize + 1;// 起始记录号
        jsnamespace['Pageniation' + table_id].end = jsnamespace['Pageniation' + table_id].begin + 1 * jsnamespace['Pageniation' + table_id].pageSize - 1;    // 末尾记录号


        if (jsnamespace['Pageniation' + table_id].end > jsnamespace['Pageniation' + table_id].len) jsnamespace['Pageniation' + table_id].end = jsnamespace['Pageniation' + table_id].len;

        Array.from( getTableByID(table_id).querySelectorAll('tr') ).map(row => {
            jsnamespace['Pageniation'].setDisplay(row, false)
        })
        let i = 0
        Array.from(getTableByID(table_id).querySelectorAll('tr')).map(row => {
            //setDisplay(row ,false)
            if ((i >= jsnamespace['Pageniation' + table_id].begin && i <= jsnamespace['Pageniation' + table_id].end) || i == 0)//显示begin<=x<=end的记录
            {
                jsnamespace['Pageniation'].setDisplay(row, true)
            }
            i++
        })
    }
}

function build_pageniation(table_id) {
    let div_ = document.createElement('div')
    div_.id = 'mask_div' + table_id;
    let len =   getTableByID(table_id).querySelectorAll('tr') .length - 1
    let pageSize = 5
    jsnamespace['Pageniation' + table_id] = {
        pageSize: pageSize,    //每页显示的记录条数
        curPage: 1,       //当前页
        lastPage: false,      //最后页
        direct: 0,       //方向
        len: len,           //总行数
        page: len % pageSize == 0 ? len / pageSize : Math.floor(len / pageSize) + 1,          //总页数
        begin: 0,
        end: 5
    }
    div_.innerHTML = `<a id="${table_id}btn0"></a>
      <a href="#" id="${table_id}btn1" onclick="jsnamespace['Pageniation'].firstPage('${table_id}')">首页</a>
      <a href="#" id="${table_id}btn2" onclick="jsnamespace['Pageniation'].frontPage('${table_id}')" >上一页</a>
      <a href="#" id="${table_id}btn3" onclick="jsnamespace['Pageniation'].nextPage('${table_id}')">下一页</a>
      <a href="#" id="${table_id}btn4" onclick="jsnamespace['Pageniation'].lastPage('${table_id}')">尾页</a>
       `
    return div_
}

function double_check_tables(){
  list_tables().map(tb_id=>{
     
    let div_  = document.getElementById( 'mask_div' + tb_id)
    if (div_ && div_.style.display !='none')
      init_table(tb_id)
  })
}

function init_table(table_id) {
  let tb = getTableByID(table_id) 
  let div_ = build_pageniation(table_id)
  insertAfter(div_, tb)
  jsnamespace['Pageniation'].displayPage(table_id);
}

window.onload = function () {
  //d3 
  if (d3) {
    d3.selectAll('.mermaid .stateGroup').on('click', function (d, i) {
      var stateID = d3.select(this).attr('id')
      show_footer(stateID);
      window.stateID = stateID;
      d3.event.stopPropagation();
    });
  }

  var divFooter = document.querySelector('.footer');
  document.addEventListener("click", function (event) {
    if (event.target.id && divFooter.querySelector('#' + event.target.id) == null) {
      divFooter.style.display = "none";
    }
  });






  document.querySelector('#state_select').onchange = function () {
    let data = JSON.stringify({
      'value': this.value,
      'id': this.id,
      'stateID': window.stateID,
    });
    fetch('http://runable/action_select', {
      body: data,
      'Access-Control-Allow-Origin': '*',
      method: 'POST',
    }).then(res => {
      console.log(res)
      return res
    })
      .catch(err => {
        console.log(err)
      })

  }

  
  function callback_mutation(mutation) {
    let type = mutation.type;
    switch (type) {
      case "childList":
        console.log("A child node has been added or removed.", mutation);
        Array.from(mutation.addedNodes).map(el => {
          console.log( 'el', el )
          if (el.tagName == 'TABLE') {
            let tb_id = getTableID(el)
            init_table(tb_id)
          }
        })
        break;
      case "attributes":
        console.log(`The ${mutation.attributeName} attribute was modified.`, mutation);
        break;
      case "subtree":
        console.log(`The subtree was modified.`, mutation);
        break;
      default:
        break;
    }
  }
  // 使用MutationObserver对象的observe方法对目标节点监听
  function listen(element, fn) {
    var observer = createMutationObserverObject(fn);
    if (!observer) return;
    observer.observe(element, {   childList: true,   });
  }

   
  listen(document, callback_mutation)
  //var cw = document.getElementById('FrameDesktopPreview')
  //if (cw) {
  //  var data = tables_fetch()
  //   cw.contentWindow.postMessage(JSON.stringify(data), '*')
  //}
}


function current_filename( cb ){

  fetch('http://localfiles/current', {
    'Access-Control-Allow-Origin': '*',
     method: 'GET',
  }).then(res => {
    return res.text()
  }).then( res=>{
     cb ( res )
  })
  .catch(err => {
      console.log(err)
  })
}


function postFrame(div_id, data) {
  var cw = document.getElementById(div_id)
  if (cw) {
    cw.contentWindow.postMessage(data, '*')
  }
}


function show_footer(state) {
  var nodelist = document.querySelector('#' + state + '-note');
  if (nodelist) {
    var note = nodelist.querySelector('.noteText tspan').innerHTML;
    var notes = note.split('run!')
    if (notes.length > 1) {
      document.querySelector('.footer').style.display = 'block'
      var cmd = notes[1]
      document.querySelector('#state_select').value = cmd
    }
  }
}

function hide_footer() {
  document.querySelector('.footer').style.display = 'none'
}

function jsonPath(obj, expr, arg) {
  var P = {
    resultType: arg && arg.resultType || "VALUE",
    result: [],
    normalize: function (expr) {
      var subx = [];
      return expr.replace(/[\['](\??\(.*?\))[\]']/g, function ($0, $1) { return "[#" + (subx.push($1) - 1) + "]"; })
        .replace(/'?\.'?|\['?/g, ";")
        .replace(/;;;|;;/g, ";..;")
        .replace(/;$|'?\]|'$/g, "")
        .replace(/#([0-9]+)/g, function ($0, $1) { return subx[$1]; });
    },
    asPath: function (path) {
      var x = path.split(";"), p = "$";
      for (var i = 1, n = x.length; i < n; i++)
        p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
      return p;
    },
    store: function (p, v) {
      if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
      return !!p;
    },
    trace: function (expr, val, path) {
      if (expr) {
        var x = expr.split(";"), loc = x.shift();
        x = x.join(";");
        if (val && val.hasOwnProperty(loc))
          P.trace(x, val[loc], path + ";" + loc);
        else if (loc === "*")
          P.walk(loc, x, val, path, function (m, l, x, v, p) { P.trace(m + ";" + x, v, p); });
        else if (loc === "..") {
          P.trace(x, val, path);
          P.walk(loc, x, val, path, function (m, l, x, v, p) { typeof v[m] === "object" && P.trace("..;" + x, v[m], p + ";" + m); });
        }
        else if (/,/.test(loc)) { // [name1,name2,...]
          for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
            P.trace(s[i] + ";" + x, val, path);
        }
        else if (/^\(.*?\)$/.test(loc)) // [(expr)]
          P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
        else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
          P.walk(loc, x, val, path, function (m, l, x, v, p) { if (P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) P.trace(m + ";" + x, v, p); });
        else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
          P.slice(loc, x, val, path);
      }
      else
        P.store(path, val);
    },
    walk: function (loc, expr, val, path, f) {
      if (val instanceof Array) {
        for (var i = 0, n = val.length; i < n; i++)
          if (i in val)
            f(i, loc, expr, val, path);
      }
      else if (typeof val === "object") {
        for (var m in val)
          if (val.hasOwnProperty(m))
            f(m, loc, expr, val, path);
      }
    },
    slice: function (loc, expr, val, path) {
      if (val instanceof Array) {
        var len = val.length, start = 0, end = len, step = 1;
        loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) { start = parseInt($1 || start); end = parseInt($2 || end); step = parseInt($3 || step); });
        start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
        end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
        for (var i = start; i < end; i += step)
          P.trace(i + ";" + expr, val, path);
      }
    },
    eval: function (x, _v, _vname) {
      try { return $ && _v && eval(x.replace(/@/g, "_v")); }
      catch (e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
    }
  };

  var $ = obj;
  if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
    P.trace(P.normalize(expr).replace(/^\$;/, ""), obj, "$");
    return P.result.length ? P.result : false;
  }
}

const zip = (...arrays) => {
  const length = Math.min(...arrays.map(arr => arr.length));
  return Array.from({ length }, (value, index) => arrays.map((array => array[index])));
};

const fromEntries = (arrays) => {
  var obj = {}
  arrays.map(e => {
    obj[e[0]] = e[1]
  })
  return obj
}

function table_to_object(jstable) {
  return Array.from(jstable.rows.map(e => fromEntries(
    zip(jstable.header, e)
  )))
}

function subtask(id) {
  let task_content = document.querySelector('.task-list .task-list-item #task0').parentNode.querySelector('a').innerText
  let time_node = document.querySelector('.task-list .task-list-item #task0').parentNode.querySelector('label')
  let time = time_node ? time_node.innerText : ""
  let data = JSON.stringify({
    'value': task_content,
    'time': time,
  });
  fetch('http://supertask/action_select', {
    body: data,
    'Access-Control-Allow-Origin': '*',
    method: 'POST',
  }).then(res => {
    console.log(res)
    return res
  })
    .catch(err => {
      console.log(err)
    })
}

var importCssJs = {
  css: function (path) {
    if (!path || path.length === 0) {
      throw new Error('参数"path"错误');
    }
    if (path.startsWith('.')) {
      path = path.replace('./', '')
    }
    let existed = Array.from(document.querySelectorAll('head link')).filter(el => {
      if (el.src)
        return el.src.indexOf(path) != -1
      return false
    })
    console.log(existed)
    if (existed.length > 0) {
      return
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
  },
  js: function (path) {
    if (!path || path.length === 0) {
      throw new Error('参数"path"错误');
    }
    if (path.startsWith('.')) {
      path = path.replace('./', '')
    }
    let existed = Array.from(document.querySelectorAll('head script')).filter(el => {
      if (el.src)
        return el.src.indexOf(path) != -1
      return false
    })
    console.log(existed)
    if (existed.length > 0) {
      return
    }
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    head.appendChild(script);
  }
}