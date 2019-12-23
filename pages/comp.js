import React from 'react';
import gql from 'graphql-tag';
import expr from 'expression-eval';
import { useQuery } from '@apollo/react-hooks';

import { client } from '../src/data/datocms';
import { ErrorView, Text } from '../src/presentational';

const add = (a, b) => a + b;
const Bold = ({ children }) => <b>{children}</b>;

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
    didSucceed: { c: 'intro !== null' },
    intro: { c: 'query.home.introText' },
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
const isVar = prop => 'v' in prop;
const isCode = prop => 'c' in prop;
const getVarNameOrValue = prop => prop.v || prop;
const getVar = (vars, prop) => vars[prop.v];
const getVarOrPrimitive = (vars, prop) => {
  if (typeof prop !== 'object') {
    return prop;
  }
  if (isVar(prop)) {
    return getVar(vars, prop);
  }
  return prop;
};

function getVertex(e) {
  if (!e || typeof e !== 'object') {
    return e;
  }
  if (isVar(e)) {
    return getVarName(e);
  }
  if (isCode(e)) {
    return expr.parse(e);
  }
  return e;
}
function astDfs(G, visit, v, order) {
  if (v.type === 'Identifier') {
    const e = v.name;
    if (visit[e] !== true) {
      dfs(G, visit, e, order);
    }
  }
  if (v.left) {
    astDfs(G, visit, v.left, order);
  }
  if (v.right) {
    astDfs(G, visit, v.right, order);
  }
}
function dfs(G, visit, v, order) {
  visit[v] = true;
  const vertex = G[v];
  const V = getVertex(vertex);
  if (V) {
    if (isCode(vertex)) {
      astDfs(G, visit, V, order);
    } else {
      for (const e of V) {
        if (visit[e] !== true) {
          dfs(G, visit, e, order);
        }
      }
    }
  }
  order.push(v);
}
function topologicalSort(G) {
  const order = [];
  const visit = {};

  for (const v of Object.keys(G)) {
    if (visit[v] !== true) {
      dfs(G, visit, v, order);
    }
  }

  return order.reverse();
}

function extract(props, key, actualProps, vars) {
  const prop = props[key];
  if (typeof prop === 'object' && isVar(prop)) {
    actualProps[key] = getVar(vars, prop);
  } else {
    actualProps[key] = prop;
  }
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
  const { children, ...rest } = renderProps || {};
  const Tag = vars[tag] || tag;
  const actualProps = {};
  for (const key of Object.keys(rest)) {
    if (key !== 'style') {
      extract(renderProps, key, actualProps, vars);
    } else {
      const { style } = renderProps;
      actualProps.style = {};
      const actualStyles = actualProps.style;
      for (const styleKey of Object.keys(style)) {
        extract(style, styleKey, actualStyles, vars);
      }
    }
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
        const func = vars[funcName.v];
        vars[varName] = func(...args.map(arg => getVarOrPrimitive(vars, arg)));
      } else if (isCode(variable)) {
        const fn = expr.compile(variable.c);
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
  const { component, client, namespace, variables } = props;
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
        <ErrorView>
          <Text>Loading...</Text>
        </ErrorView>
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
  return `{
      ${pad}${Object.entries(styles)
    .map(([key, value]) => {
      const val = getter(value, key, overrides);
      return `${key}: ${val}`;
    })
    .join(`,\n      ${pad}`)}
    ${pad}}`;
}

function compileChild(pad, level, overrides) {
  const propsIndent = `\n      ${pad}`;
  const childIndent = `\n    ${pad}`;
  const nextLevel = level + 1;
  const getter = overrides ? getVarWithOverride : getVarNameOrValue;
  return child => {
    if (!child) {
      return ``;
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
    const hasChildren = children && children.length;
    return `
    ${pad}<${tag} ${hasMultipleProps ? propsIndent : ''}${propEntries
      .map(([key, value]) => {
        const val = getter(value, key, overrides);
        if (key !== 'style' || typeof val !== 'object') {
          return `${key}={${val}}`;
        } else {
          return `style={${compileStyles(val, nextLevel, overrides)}}`;
        }
      })
      .join(propsIndent)}${
      hasChildren
        ? `${hasMultipleProps ? childIndent : ''}>${compileChildren(
            children,
            nextLevel,
            overrides,
          )}
    ${pad}</${tag}>`
        : ' />'
    }`;
  };
}

function compileChildren(children, level, overrides) {
  const pad = '  '.repeat(level);
  return children
    ? children.map(compileChild(pad, level, overrides)).join('    ')
    : '';
}

function compileRender(match, patterns, params, render) {
  if (match) {
    return patterns
      .map(pattern => {
        const overrides = pattern[params.length + 1];
        const renderName = pattern[params.length];
        const output = render[renderName];
        return `if (${params
          .map((param, i) => `${param} === ${pattern[i]}`)
          .filter((_, i) => pattern[i] !== null)
          .join(' && ') || 'true'}) {
    ${
      Array.isArray(output)
        ? `return (<>${compileChildren(output, 1, overrides)}
    </>);`
        : `return (${compileChildren([output], 1, overrides)}
    );`
    }
  }`;
      })
      .join('\n  ');
  }
  if (Array.isArray(render)) {
    return `return (
    <>${compileChildren(render, 1)}
    </>
  );`;
  }
  return `return (${compileChildren([render], 0, null)}
  );`;
}

export function Compiler(props) {
  const { component, namespace, variables } = props;
  const { query, compute, match, render } = component;
  const linearVariableOrder = compute && topologicalSort(compute);
  const { params, patterns } = match || {};
  const compiledRender = compileRender(match, patterns, params, render);
  return (
    <pre style={{ margin: 0 }}>
      {`
import React from 'react';
import gql from 'graphql-tag';
import expr from 'expression-eval';
import { useQuery } from '@apollo/react-hooks';

import { client } from '../src/data';
import { ${Object.keys(namespace).join(', ')} } from '../src/namespace';
import { ErrorView, LoadingView, Text } from '../src/presentational';
${
  query
    ? `
const Query = gql\`${query}\`;
`
    : ''
}
export default function Page(props) {
  let { ${Object.entries(component.props)
    .map(([key, val]) =>
      typeof val === 'object' && 'default' in val
        ? `${key} = ${val.default}`
        : key,
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
                  const [funcName, ...args] = variable;
                  return `let ${varName} = ${funcName.v}(${args
                    .map(arg => (typeof arg === 'object' ? arg.v : arg))
                    .join(', ')});`;
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
`}
    </pre>
  );
}

export default function Test() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        color: 'black',
      }}
    >
      <h1>Preview</h1>
      <output style={{ border: '1px solid black', margin: 10, padding: 10 }}>
        <Previewer
          client={client}
          component={viewExample}
          namespace={{ add, Bold }}
          variables={{
            data: {
              isAdmin: true,
            },
          }}
        />
      </output>
      <h1 style={{ marginBottom: 0 }}>Code</h1>
      <output style={{ border: '1px solid black', margin: 10, padding: 10 }}>
        <Compiler
          client={client}
          component={viewExample}
          namespace={{ add, Bold }}
          variables={{
            data: {
              isAdmin: true,
            },
          }}
        />
      </output>
    </div>
  );
}
