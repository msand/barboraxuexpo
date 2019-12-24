/* eslint
react/jsx-props-no-spreading: "off",
react/no-array-index-key: "off",
no-restricted-syntax: "off",
no-use-before-define: "off",
no-param-reassign: "off",
*/
import React from 'react';
import gql from 'graphql-tag';
import expr from 'expression-eval';
import { useQuery } from '@apollo/react-hooks';

import { client } from '../src/data';
import { add, Bold } from '../src/namespace';
import { ErrorView, LoadingView, Text } from '../src/presentational';

const viewExample = {
  tag: 'name',
  query: `
  query IndexQuery {
    home {
      background {
        url
      }
      introText
      copyright
    }
  }
  `,
  props: {
    // set
    propName: {
      type: 'some typescript type',
      default: 'value',
    },
    rootUser: {
      type: 'Boolean',
      default: false,
    },
    query: {
      type: 'HomePageQueryType',
    },
  },
  // hooks need to be called first and always in same order, sort topologically
  compute: {
    // dag
    variableName: [
      { v: 'add' }, // first element is function to call: add
      { v: 'propName' }, // take first argument from parameter 'propName'
      { v: 'variableName2' }, // second argument from another variable
    ],
    variableName2: [{ v: 'add' }, 1, 2],
    // short js expressions / code blocks
    isAdmin: { c: 'query.isAdmin || rootUser' },
    intro: { c: 'query && query.home && query.home.introText' },
    didSucceed: { c: '!!intro' },
  },
  match: {
    // list
    params: ['isAdmin', 'didSucceed'], // #n arguments (n = 2)
    // list
    patterns: [
      // match patterns to given parameter arguments (#n predicates per pattern)
      // map to name of render output (n+1 = 3rd element in list)
      // optional prop overrides (n+2 = 4th element)
      [true, false, 'errorAdmin'],
      [
        null, // default case, null means independent of value / matches any case
        true,
        'success',
      ],
      [null, null, 'error', { overrideRenderProps: 'overriddenValue' }],
    ],
  },
  render: {
    // single component
    error: {
      // error
      tag: 'div',
      props: {
        propName: { v: 'var or prop' },
        children: [
          {
            tag: 'Bold',
            props: {
              propName: { v: 'var or prop' },
              children: ['Test error text'],
            },
          },
        ],
      },
    },
    errorAdmin: {
      tag: 'div',
      props: {
        propName: { v: 'var or prop' },
        children: [
          {
            tag: 'Bold',
            props: {
              propName: { v: 'var or prop' },
              children: ['Test admin error text'],
            },
          },
        ],
      },
    },
    // tree / fragment
    success: [
      // success
      // only used variables from directed acyclic graph need to be computed,
      // and if pure, only ones with changed inputs
      {
        tag: 'div',
        props: {
          onClick: {
            a: 'action name',
            f: 'ref to payload producing function',
            v: 'or payload variable name',
          },
          onDoubleClick: {
            e: 'effect name',
            f: 'event handling function',
            v:
              'variable name or array of names, to give as arguments when calling handler',
          },
          propName: { v: 'var or prop' },
          style: {
            cssPropName: 'cssPropValue',
            cssProp2: { v: 'var or prop' },
          },
          children: [
            {
              tag: 'div',
              props: {
                propName: { v: 'var or prop' },
                children: [{ v: 'intro' }],
              },
            },
          ],
        },
      },
      {
        tag: 'Bold',
        props: {
          propName: { v: 'var or prop' },
          children: ['Test text'],
        },
      },
    ],
  },
};

const getCode = prop => prop.c;
const getVarName = prop => prop.v;
const isObj = v => typeof v === 'object';
const notObj = v => typeof v !== 'object';
const hasOwn = Object.prototype.hasOwnProperty;
const isVar = prop => hasOwn.call(prop, 'v');
const isCode = prop => hasOwn.call(prop, 'c');
const getVarNameOrValue = prop => prop.v || prop;
const getVar = (vars, prop) => vars[prop.v];
const getVarOrPrimitive = (vars, prop) => {
  if (notObj(prop)) {
    return prop;
  }
  if (isVar(prop)) {
    return getVar(vars, prop);
  }
  return prop;
};

function getVertex(e) {
  if (!e || notObj(e)) {
    return e;
  }
  if (isVar(e)) {
    return getVarName(e);
  }
  if (isCode(e)) {
    return expr.parse(getCode(e));
  }
  return e;
}
function astDfs(G, visit, v, order) {
  const { type, name, object, argument, left, right } = v;
  if (type === 'Identifier') {
    if (visit[name] !== true) {
      dfs(G, visit, name, order);
    }
    return;
  }
  if (object) {
    astDfs(G, visit, object, order);
    return;
  }
  if (argument) {
    astDfs(G, visit, argument, order);
    return;
  }
  if (left) {
    astDfs(G, visit, left, order);
  }
  if (right) {
    astDfs(G, visit, right, order);
  }
}
function dfs(G, visit, v, order) {
  visit[v] = true;
  const vertex = G[v];
  const V = getVertex(vertex);
  if (V) {
    if (Array.isArray(V)) {
      for (const e of V) {
        const nextVertex = getVertex(e);
        if (visit[nextVertex] !== true) {
          dfs(G, visit, nextVertex, order);
        }
      }
    } else if (isCode(vertex)) {
      astDfs(G, visit, V, order);
    } else {
      // console.log("not a variable", v, vertex, V);
    }
    order.push(v);
  }
}
function topologicalSort(G) {
  const order = [];
  const visit = Object.create(null);

  for (const v of Object.keys(G)) {
    if (visit[v] !== true) {
      dfs(G, visit, v, order);
    }
  }

  return order;
}

function extract(props, key, target, vars) {
  const v = props[key];
  target[key] = isObj(v) && isVar(v) ? getVar(vars, v) : v;
}

export function RenderPreview(props) {
  const { render, vars } = props;
  if (!render || typeof render === 'string') {
    return render;
  }
  if (isVar(render)) {
    return getVar(vars, render);
  }
  if (Array.isArray(render)) {
    return render.map((child, i) => (
      <RenderPreview key={i} render={child} vars={vars} />
    ));
  }
  const { tag, props: renderProps } = render;
  const { children, style, ...rest } = renderProps || {};
  const Tag = vars[tag] || tag;
  const actualProps = {};
  if (style) {
    actualProps.style = {};
    const actualStyles = actualProps.style;
    for (const styleKey of Object.entries(style)) {
      extract(style, styleKey, actualStyles, vars);
    }
  }
  for (const key of Object.keys(rest)) {
    extract(renderProps, key, actualProps, vars);
  }
  return (
    <Tag {...actualProps}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <RenderPreview key={i} render={child} vars={vars} />
          ))
        : children}
    </Tag>
  );
}

function matchPattern(paramValues, length, pattern) {
  for (let i = 0, l = length; i < l; i += 1) {
    const condition = pattern[i];
    if (condition !== null && paramValues[i] !== condition) {
      return false;
    }
  }
  return true;
}

export function Preview(props) {
  const { component, data, namespace, variables } = props;
  const { compute, match } = component;
  const vars = { ...namespace, ...variables, query: data };
  if (compute) {
    const linearVariableOrder = topologicalSort(compute);
    for (const varName of linearVariableOrder) {
      const variable = compute[varName];
      if (!variable) {
        // console.log(varName, variable);
      } else if (Array.isArray(variable)) {
        const [funcName, ...args] = variable;
        const func = getVarOrPrimitive(vars, funcName);
        vars[varName] = func(...args.map(arg => getVarOrPrimitive(vars, arg)));
      } else if (isCode(variable)) {
        const fn = expr.compile(getCode(variable));
        vars[varName] = fn(vars);
      }
    }
  }
  let { render } = component;
  if (match) {
    const { params, patterns } = match;
    const paramValues = params.map(param => vars[param]);
    const { length } = params;
    for (const pattern of patterns) {
      if (matchPattern(paramValues, length, pattern)) {
        const renderOutput = pattern[length];
        const overrides = pattern[length + 1];
        render = render[renderOutput];
        if (overrides) {
          for (const key of Object.keys(overrides)) {
            const override = overrides[key];
            vars[key] = getVarOrPrimitive(vars, override);
          }
        }
        break;
      }
    }
  }
  return <RenderPreview render={render} vars={vars} />;
}
export function Previewer(props) {
  const { component, namespace, variables } = props;
  const { query } = component;
  if (query) {
    const { loading, data, error } = useQuery(
      gql`
        ${query}
      `,
      {
        variables,
        client,
      },
    );
    if (loading) {
      return (
        <LoadingView>
          <Text>Loading...</Text>
        </LoadingView>
      );
    }
    if (error) {
      return (
        <ErrorView>
          <Text>Error! {error.message}</Text>
        </ErrorView>
      );
    }
    return (
      <Preview
        data={data}
        component={component}
        namespace={namespace}
        variables={variables}
      />
    );
  }
  return (
    <Preview
      data={variables ? variables.data : undefined}
      component={component}
      namespace={namespace}
      variables={variables}
    />
  );
}

function getVarWithOverride(value, key, overrides) {
  return overrides[key] || getVarNameOrValue(value);
}

function compileStyles(styles, level, overrides) {
  const pad = '  '.repeat(level);
  const getter = overrides ? getVarWithOverride : getVarNameOrValue;
  const nl = '\n    ';
  const body = `${nl}  ${pad}`;
  return `{${body}${Object.entries(styles)
    .map(([key, value]) => {
      const val = getter(value, key, overrides);
      return `${key}: ${val}`;
    })
    .join(`,${body}`)}${nl}${pad}}`;
}

function compileChild(pad, level, overrides) {
  const getter = overrides ? getVarWithOverride : getVarNameOrValue;
  const propsIndent = `\n      ${pad}`;
  const childIndent = `\n    ${pad}`;
  const next = level + 1;
  return child => {
    if (!child) {
      return '';
    }
    const isString = typeof child === 'string';
    if (isString) {
      return `\n    ${pad}${child}`;
    }
    if (isVar(child)) {
      return `\n    ${pad}{${getVarName(child)}}`;
    }
    const { props, tag } = child;
    const { children, ...rest } = props || {};
    const propEntries = Object.entries(rest);
    const hasMultipleProps = propEntries.length > 1;
    const preAttrs = hasMultipleProps ? propsIndent : '';
    const attrs = propEntries
      .map(([key, value]) => {
        const val = getter(value, key, overrides);
        if (key !== 'style' || notObj(val)) {
          return `${key}={${val}}`;
        }
        return `style={${compileStyles(val, next, overrides)}}`;
      })
      .join(propsIndent);
    const start = `<${tag} ${preAttrs}${attrs}`;
    const hasChildren = children && children.length;
    const postAttrs = hasMultipleProps ? childIndent : '';
    const inner = hasChildren && compileChildren(children, next, overrides);
    const end = inner ? `${postAttrs}>${inner}${childIndent}</${tag}>` : ' />';
    return `${childIndent}${start}${end}`;
  };
}

function compileChildren(children, level, overrides) {
  const pad = '  '.repeat(level);
  return children
    ? children.map(compileChild(pad, level, overrides)).join('    ')
    : '';
}

function compileRender(match, render) {
  const nl = '\n  ';
  const returnIndent = `${nl}  `;
  if (match) {
    const { params, patterns } = match;
    return patterns
      .map(pattern => {
        const overrides = pattern[params.length + 1];
        const renderName = pattern[params.length];
        const output = render[renderName];
        const condition = params
          .map((param, i) => `${param} === ${pattern[i]}`)
          .filter((_, i) => pattern[i] !== null)
          .join(' && ');
        const level = condition ? 1 : 0;
        const pad = '  '.repeat(level);
        const body = `${nl}${pad}`;
        const pre = condition ? `if (${condition}) {${body}` : '';
        const post = condition ? `${nl}}` : '';
        const compiledChildren = Array.isArray(output)
          ? `return (<>${compileChildren(
              output,
              level,
              overrides,
            )}${returnIndent}</>);`
          : `return (${compileChildren([output], level, overrides)}${body});`;
        return `${pre}${compiledChildren}${post}`;
      })
      .join(nl);
  }
  if (Array.isArray(render)) {
    const compiledChildren = compileChildren(render, 1);
    return `return (${returnIndent}<>${compiledChildren}${returnIndent}</>${nl});`;
  }
  return `return (${compileChildren([render], 0, null)}${nl});`;
}

export function compile(props) {
  const { component, namespace } = props;
  const { query, compute, match, render } = component;
  const compiledRender = compileRender(match, render);
  const linearVariableOrder = compute && topologicalSort(compute);
  return `import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { client } from '../src/data';
import { ${Object.keys(namespace).join(', ')} } from '../src/namespace';
import { ErrorView, LoadingView, Text } from '../src/presentational';
${query ? `\nconst Query = gql\`${query}\`;\n` : ''}
export default function Page(props) {
  let { ${Object.entries(component.props)
    .map(([key, val]) =>
      hasOwn.call(val, 'default') ? `${key} = ${val.default}` : key,
    )
    .join(', ')} } = props;
  ${
    query
      ? `const { loading, data, error } = useQuery(Query, {
    variables: props,
    client,
  });
  if (loading) {
    return (
      <LoadingView>
        <Text>Loading...</Text>
      </LoadingView>
    );
  }
  if (error) {
    return (
      <ErrorView>
        <Text>Error! {error.message}</Text>
      </ErrorView>
    );
  }
  query = data;
  `
      : ''
  }${
    compute
      ? linearVariableOrder
          .map(varName => {
            let variable = compute[varName];
            if (variable === undefined) {
              variable = namespace[varName];
            }
            if (!variable) {
              // console.log(varName, variable);
            } else if (Array.isArray(variable)) {
              const [funcName, ...params] = variable;
              const func = getVarNameOrValue(funcName);
              const args = params
                .map(p => (isObj(p) ? getVarNameOrValue(p) : p))
                .join(', ');
              return `let ${varName} = ${func}(${args});`;
            } else if (isCode(variable)) {
              return `let ${varName} = ${getCode(variable)};`;
            }
            return false;
          })
          .filter(Boolean)
          .join('\n  ')
      : ''
  }
  ${compiledRender}
}
`;
}

const styles = {
  pre: { margin: 0 },
  container: {
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
  },
  output: { border: '1px solid black', margin: 10, padding: 10 },
};

export function Compiler(props) {
  const code = compile(props);
  return <pre style={styles.pre}>{code}</pre>;
}

const namespace = { add, Bold };
const variables = {
  data: {
    isAdmin: true,
  },
};
export default function Test() {
  return (
    <div style={styles.container}>
      <h1>Preview</h1>
      <output style={styles.output}>
        <Previewer
          component={viewExample}
          namespace={namespace}
          variables={variables}
        />
      </output>
      <h1>Code</h1>
      <output style={styles.output}>
        <Compiler
          component={viewExample}
          namespace={namespace}
          variables={variables}
        />
      </output>
    </div>
  );
}
