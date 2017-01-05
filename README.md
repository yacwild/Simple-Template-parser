#Simple-Template-parser

Helper supported:

### if 
```
{%if expression%}
 ...
{%elseif expression%}
 ...
{%else%}
 ...
{%endif%}
```

### switch
```
{%switch expression%}
 ...
{%case expression%}
 ...
{%endcase%}
 ...
{%default%}
 ...
{%endswitch%}
```

### each
```
{%each data as value,index%}
 ...
{%endeach%}
```
### var
```
{%varname=expression%}
```
### expression
other expression
```
{% true %}
```
