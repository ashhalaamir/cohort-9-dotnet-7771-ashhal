À$
jC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Services\UserService.cs
	namespace 	
TaskManagement
 
. 
Core 
. 
Services &
{ 
public 

class 
UserService 
: 
IUserService +
{ 
private 
readonly 
IUserRepository (
_userRepository) 8
;8 9
public

 
UserService

 
(

 
IUserRepository

 *
userRepository

+ 9
)

9 :
{ 	!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
userRepository. <
)< =
;= >
_userRepository 
= 
userRepository ,
;, -
} 	
public 
async 
System 
. 
	Threading %
.% &
Tasks& +
.+ ,
Task, 0
<0 1
User1 5
>5 6
CreateAsync7 B
(B C
UserC G
userH L
)L M
{ 	!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
user. 2
)2 3
;3 4
return 
await 
_userRepository (
.( )
CreateAsync) 4
(4 5
user5 9
)9 :
;: ;
} 	
public 
async 
System 
. 
	Threading %
.% &
Tasks& +
.+ ,
Task, 0
<0 1
User1 5
?5 6
>6 7
GetByIdAsync8 D
(D E
intE H
idI K
)K L
{ 	
return 
await 
_userRepository (
.( )
GetByIdAsync) 5
(5 6
id6 8
)8 9
;9 :
} 	
public 
async 
System 
. 
	Threading %
.% &
Tasks& +
.+ ,
Task, 0
<0 1
User1 5
?5 6
>6 7
GetByEmailAsync8 G
(G H
stringH N
emailO T
)T U
{ 	!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
email. 3
)3 4
;4 5
if 
( 
string 
. 
IsNullOrWhiteSpace )
() *
email* /
)/ 0
)0 1
throw 
new 
ArgumentException +
(+ ,
$str, F
,F G
nameofH N
(N O
emailO T
)T U
)U V
;V W
return   
await   
_userRepository   (
.  ( )
GetByEmailAsync  ) 8
(  8 9
email  9 >
)  > ?
;  ? @
}!! 	
public## 
async## 
System## 
.## 
	Threading## %
.##% &
Tasks##& +
.##+ ,
Task##, 0
<##0 1
IEnumerable##1 <
<##< =
User##= A
>##A B
>##B C
GetAllAsync##D O
(##O P
)##P Q
{$$ 	
return%% 
await%% 
_userRepository%% (
.%%( )
GetAllAsync%%) 4
(%%4 5
)%%5 6
;%%6 7
}&& 	
public(( 
async(( 
System(( 
.(( 
	Threading(( %
.((% &
Tasks((& +
.((+ ,
Task((, 0
<((0 1
User((1 5
>((5 6
UpdateAsync((7 B
(((B C
User((C G
user((H L
)((L M
{)) 	!
ArgumentNullException** !
.**! "
ThrowIfNull**" -
(**- .
user**. 2
)**2 3
;**3 4
return++ 
await++ 
_userRepository++ (
.++( )
UpdateAsync++) 4
(++4 5
user++5 9
)++9 :
;++: ;
},, 	
public.. 
async.. 
System.. 
... 
	Threading.. %
...% &
Tasks..& +
...+ ,
Task.., 0
DeleteAsync..1 <
(..< =
int..= @
id..A C
)..C D
{// 	
await00 
_userRepository00 !
.00! "
DeleteAsync00" -
(00- .
id00. 0
)000 1
;001 2
}11 	
}22 
}33 èj
jC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Services\TaskService.cs
	namespace 	
TaskManagement
 
. 
Core 
. 
Services &
{ 
public		 

class		 
TaskService		 
:		 
ITaskService		 +
{

 
private 
readonly 
ITaskRepository (
_taskRepository) 8
;8 9
private 
readonly 
IUserRepository (
_userRepository) 8
;8 9
public 
TaskService 
( 
ITaskRepository *
taskRepository+ 9
,9 :
IUserRepository; J
userRepositoryK Y
)Y Z
{ 	!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
taskRepository. <
)< =
;= >!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
userRepository. <
)< =
;= >
_taskRepository 
= 
taskRepository ,
;, -
_userRepository 
= 
userRepository ,
;, -
} 	
public 
async 
System 
. 
	Threading %
.% &
Tasks& +
.+ ,
Task, 0
<0 1

TaskEntity1 ;
>; <
CreateAsync= H
(H I

TaskEntityI S
taskT X
,X Y
intZ ]
userId^ d
)d e
{ 	!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
task. 2
)2 3
;3 4
ValidateTask 
( 
task 
) 
; 
task 
. 
UserId 
= 
userId  
;  !
return   
await   
_taskRepository   (
.  ( )
CreateAsync  ) 4
(  4 5
task  5 9
)  9 :
;  : ;
}!! 	
public## 
async## 
System## 
.## 
	Threading## %
.##% &
Tasks##& +
.##+ ,
Task##, 0
<##0 1

TaskEntity##1 ;
?##; <
>##< =
GetByIdAsync##> J
(##J K
int##K N
id##O Q
,##Q R
int##S V
userId##W ]
,##] ^
bool##_ c
isAdmin##d k
)##k l
{$$ 	
var%% 
task%% 
=%% 
await%% 
_taskRepository%% ,
.%%, -
GetByIdAsync%%- 9
(%%9 :
id%%: <
)%%< =
;%%= >
if&& 
(&& 
task&& 
==&& 
null&& 
)&& 
return&& $
null&&% )
;&&) *
if)) 
()) 
!)) 
isAdmin)) 
&&)) 
task))  
.))  !
UserId))! '
!=))( *
userId))+ 1
)))1 2
return** 
null** 
;** 
return,, 
task,, 
;,, 
}-- 	
public// 
async// 
System// 
.// 
	Threading// %
.//% &
Tasks//& +
.//+ ,
Task//, 0
<//0 1
IEnumerable//1 <
<//< =

TaskEntity//= G
>//G H
>//H I
GetAllAsync//J U
(//U V
int//V Y
userId//Z `
,//` a
bool//b f
isAdmin//g n
)//n o
{00 	
if11 
(11 
isAdmin11 
)11 
return22 
await22 
_taskRepository22 ,
.22, -
GetAllAsync22- 8
(228 9
)229 :
;22: ;
else33 
return44 
await44 
_taskRepository44 ,
.44, -
GetByUserIdAsync44- =
(44= >
userId44> D
)44D E
;44E F
}55 	
public77 
async77 
System77 
.77 
	Threading77 %
.77% &
Tasks77& +
.77+ ,
Task77, 0
<770 1
IEnumerable771 <
<77< =

TaskEntity77= G
>77G H
>77H I
GetByUserIdAsync77J Z
(77Z [
int77[ ^
targetUserId77_ k
,77k l
int77m p
requesterUserId	77q Ä
,
77Ä Å
bool
77Ç Ü
isAdmin
77á é
)
77é è
{88 	
if99 
(99 
!99 
isAdmin99 
&&99 
targetUserId99 (
!=99) +
requesterUserId99, ;
)99; <
return:: 

Enumerable:: !
.::! "
Empty::" '
<::' (

TaskEntity::( 2
>::2 3
(::3 4
)::4 5
;::5 6
return<< 
await<< 
_taskRepository<< (
.<<( )
GetByUserIdAsync<<) 9
(<<9 :
targetUserId<<: F
)<<F G
;<<G H
}== 	
public?? 
async?? 
System?? 
.?? 
	Threading?? %
.??% &
Tasks??& +
.??+ ,
Task??, 0
<??0 1

TaskEntity??1 ;
???; <
>??< =
UpdateAsync??> I
(??I J
int??J M
id??N P
,??P Q

TaskEntity??R \
updatedTask??] h
,??h i
int??j m
userId??n t
,??t u
bool??v z
isAdmin	??{ Ç
)
??Ç É
{@@ 	!
ArgumentNullExceptionAA !
.AA! "
ThrowIfNullAA" -
(AA- .
updatedTaskAA. 9
)AA9 :
;AA: ;
varCC 
existingTaskCC 
=CC 
awaitCC $
_taskRepositoryCC% 4
.CC4 5
GetByIdAsyncCC5 A
(CCA B
idCCB D
)CCD E
;CCE F
ifDD 
(DD 
existingTaskDD 
==DD 
nullDD  $
)DD$ %
returnDD& ,
nullDD- 1
;DD1 2
ifGG 
(GG 
!GG 
isAdminGG 
&&GG 
existingTaskGG (
.GG( )
UserIdGG) /
!=GG0 2
userIdGG3 9
)GG9 :
returnHH 
nullHH 
;HH 
ValidateTaskJJ 
(JJ 
updatedTaskJJ $
)JJ$ %
;JJ% &
existingTaskMM 
.MM 
TitleMM 
=MM  
updatedTaskMM! ,
.MM, -
TitleMM- 2
;MM2 3
existingTaskNN 
.NN 
DescriptionNN $
=NN% &
updatedTaskNN' 2
.NN2 3
DescriptionNN3 >
;NN> ?
existingTaskOO 
.OO 
StatusOO 
=OO  !
updatedTaskOO" -
.OO- .
StatusOO. 4
;OO4 5
existingTaskPP 
.PP 
PriorityPP !
=PP" #
updatedTaskPP$ /
.PP/ 0
PriorityPP0 8
;PP8 9
existingTaskQQ 
.QQ 
CategoryQQ !
=QQ" #
updatedTaskQQ$ /
.QQ/ 0
CategoryQQ0 8
;QQ8 9
existingTaskRR 
.RR 
DueDateRR  
=RR! "
updatedTaskRR# .
.RR. /
DueDateRR/ 6
;RR6 7
existingTaskSS 
.SS 
	UpdatedAtSS "
=SS# $
DateTimeSS% -
.SS- .
UtcNowSS. 4
;SS4 5
returnUU 
awaitUU 
_taskRepositoryUU (
.UU( )
UpdateAsyncUU) 4
(UU4 5
existingTaskUU5 A
)UUA B
;UUB C
}VV 	
publicXX 
asyncXX 
SystemXX 
.XX 
	ThreadingXX %
.XX% &
TasksXX& +
.XX+ ,
TaskXX, 0
<XX0 1
boolXX1 5
>XX5 6
DeleteAsyncXX7 B
(XXB C
intXXC F
idXXG I
,XXI J
intXXK N
userIdXXO U
,XXU V
boolXXW [
isAdminXX\ c
)XXc d
{YY 	
varZZ 
taskZZ 
=ZZ 
awaitZZ 
_taskRepositoryZZ ,
.ZZ, -
GetByIdAsyncZZ- 9
(ZZ9 :
idZZ: <
)ZZ< =
;ZZ= >
if[[ 
([[ 
task[[ 
==[[ 
null[[ 
)[[ 
return[[ $
false[[% *
;[[* +
if^^ 
(^^ 
!^^ 
isAdmin^^ 
&&^^ 
task^^  
.^^  !
UserId^^! '
!=^^( *
userId^^+ 1
)^^1 2
return__ 
false__ 
;__ 
awaitaa 
_taskRepositoryaa !
.aa! "
DeleteAsyncaa" -
(aa- .
idaa. 0
)aa0 1
;aa1 2
returnbb 
truebb 
;bb 
}cc 	
publicee 
asyncee 
Systemee 
.ee 
	Threadingee %
.ee% &
Tasksee& +
.ee+ ,
Taskee, 0
<ee0 1

TaskEntityee1 ;
?ee; <
>ee< =
AssignTaskAsyncee> M
(eeM N
inteeN Q
taskIdeeR X
,eeX Y
inteeZ ]
assignToUserIdee^ l
,eel m
inteen q
adminUserIdeer }
,ee} ~
bool	ee É
isAdmin
eeÑ ã
)
eeã å
{ff 	
ifgg 
(gg 
!gg 
isAdmingg 
)gg 
returnhh 
nullhh 
;hh 
varjj 
taskjj 
=jj 
awaitjj 
_taskRepositoryjj ,
.jj, -
GetByIdAsyncjj- 9
(jj9 :
taskIdjj: @
)jj@ A
;jjA B
ifkk 
(kk 
taskkk 
==kk 
nullkk 
)kk 
returnll 
nullll 
;ll 
varnn 
assignToUsernn 
=nn 
awaitnn $
_userRepositorynn% 4
.nn4 5
GetByIdAsyncnn5 A
(nnA B
assignToUserIdnnB P
)nnP Q
;nnQ R
ifoo 
(oo 
assignToUseroo 
==oo 
nulloo  $
)oo$ %
returnpp 
nullpp 
;pp 
taskrr 
.rr 
UserIdrr 
=rr 
assignToUserIdrr (
;rr( )
taskss 
.ss 
	UpdatedAtss 
=ss 
DateTimess %
.ss% &
UtcNowss& ,
;ss, -
returnuu 
awaituu 
_taskRepositoryuu (
.uu( )
UpdateAsyncuu) 4
(uu4 5
taskuu5 9
)uu9 :
;uu: ;
}vv 	
publicxx 
asyncxx 
Systemxx 
.xx 
	Threadingxx %
.xx% &
Tasksxx& +
.xx+ ,
Taskxx, 0
<xx0 1
IEnumerablexx1 <
<xx< =

TaskEntityxx= G
>xxG H
>xxH I
GetFilteredAsyncxxJ Z
(xxZ [
TaskFilterDtoxx[ h
filterxxi o
,xxo p
intxxq t
userIdxxu {
,xx{ |
bool	xx} Å
isAdmin
xxÇ â
)
xxâ ä
{yy 	!
ArgumentNullExceptionzz !
.zz! "
ThrowIfNullzz" -
(zz- .
filterzz. 4
)zz4 5
;zz5 6
return{{ 
await{{ 
_taskRepository{{ (
.{{( )
GetFilteredAsync{{) 9
({{9 :
filter{{: @
,{{@ A
userId{{B H
,{{H I
isAdmin{{J Q
){{Q R
;{{R S
}|| 	
private~~ 
static~~ 
void~~ 
ValidateTask~~ (
(~~( )

TaskEntity~~) 3
task~~4 8
)~~8 9
{ 	
if
ÄÄ 
(
ÄÄ 
string
ÄÄ 
.
ÄÄ  
IsNullOrWhiteSpace
ÄÄ )
(
ÄÄ) *
task
ÄÄ* .
.
ÄÄ. /
Title
ÄÄ/ 4
)
ÄÄ4 5
)
ÄÄ5 6
throw
ÅÅ 
new
ÅÅ 
System
ÅÅ  
.
ÅÅ  !
ComponentModel
ÅÅ! /
.
ÅÅ/ 0
DataAnnotations
ÅÅ0 ?
.
ÅÅ? @!
ValidationException
ÅÅ@ S
(
ÅÅS T
$str
ÅÅT h
)
ÅÅh i
;
ÅÅi j
if
ÉÉ 
(
ÉÉ 
task
ÉÉ 
.
ÉÉ 
Description
ÉÉ  
?
ÉÉ  !
.
ÉÉ! "
Length
ÉÉ" (
>
ÉÉ) *
$num
ÉÉ+ /
)
ÉÉ/ 0
throw
ÑÑ 
new
ÑÑ 
System
ÑÑ  
.
ÑÑ  !
ComponentModel
ÑÑ! /
.
ÑÑ/ 0
DataAnnotations
ÑÑ0 ?
.
ÑÑ? @!
ValidationException
ÑÑ@ S
(
ÑÑS T
$strÑÑT Ä
)ÑÑÄ Å
;ÑÑÅ Ç
if
ÜÜ 
(
ÜÜ 
task
ÜÜ 
.
ÜÜ 
DueDate
ÜÜ 
.
ÜÜ 
Date
ÜÜ !
<
ÜÜ" #
DateTime
ÜÜ$ ,
.
ÜÜ, -
UtcNow
ÜÜ- 3
.
ÜÜ3 4
Date
ÜÜ4 8
)
ÜÜ8 9
throw
áá 
new
áá 
System
áá  
.
áá  !
ComponentModel
áá! /
.
áá/ 0
DataAnnotations
áá0 ?
.
áá? @!
ValidationException
áá@ S
(
ááS T
$str
ááT u
)
ááu v
;
ááv w
}
àà 	
}
ââ 
}ää q
oC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Services\DashboardService.cs¬H
jC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Services\AuthService.cs
	namespace		 	
TaskManagement		
 
.		 
Core		 
.		 
Services		 &
{

 
public 

class 
AuthService 
: 
IAuthService +
{ 
private 
readonly 
IUserRepository (
_userRepository) 8
;8 9
private 
readonly 
JwtSettings $
_jwtSettings% 1
;1 2
public 
AuthService 
( 
IUserRepository *
userRepository+ 9
,9 :
JwtSettings; F
jwtSettingsG R
)R S
{ 	!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
userRepository. <
)< =
;= >!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
jwtSettings. 9
)9 :
;: ;
_userRepository 
= 
userRepository ,
;, -
_jwtSettings 
= 
jwtSettings &
;& '
} 	
public 
async 
Task 
< 
User 
? 
>  
Register! )
() *
string* 0
username1 9
,9 :
string; A
emailB G
,G H
stringI O
passwordP X
)X Y
{ 	!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
username. 6
)6 7
;7 8!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
email. 3
)3 4
;4 5!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
password. 6
)6 7
;7 8
if 
( 
string 
. 
IsNullOrWhiteSpace )
() *
username* 2
)2 3
)3 4
throw 
new 
ArgumentException +
(+ ,
$str, I
,I J
nameofK Q
(Q R
usernameR Z
)Z [
)[ \
;\ ]
if   
(   
string   
.   
IsNullOrWhiteSpace   )
(  ) *
email  * /
)  / 0
)  0 1
throw!! 
new!! 
ArgumentException!! +
(!!+ ,
$str!!, F
,!!F G
nameof!!H N
(!!N O
email!!O T
)!!T U
)!!U V
;!!V W
if"" 
("" 
string"" 
."" 
IsNullOrWhiteSpace"" )
("") *
password""* 2
)""2 3
)""3 4
throw## 
new## 
ArgumentException## +
(##+ ,
$str##, I
,##I J
nameof##K Q
(##Q R
password##R Z
)##Z [
)##[ \
;##\ ]
var&& 
existingUser&& 
=&& 
await&& $
_userRepository&&% 4
.&&4 5
GetByEmailAsync&&5 D
(&&D E
email&&E J
)&&J K
;&&K L
if'' 
('' 
existingUser'' 
!='' 
null''  $
)''$ %
return(( 
null(( 
;(( 
var++ 
user++ 
=++ 
new++ 
User++ 
{,, 
Username-- 
=-- 
username-- #
,--# $
Email.. 
=.. 
email.. 
,.. 
PasswordHash// 
=// 
PasswordHasher// -
.//- .
HashPassword//. :
(//: ;
password//; C
)//C D
,//D E
Role00 
=00 
$str00 $
}11 
;11 
return33 
await33 
_userRepository33 (
.33( )
CreateAsync33) 4
(334 5
user335 9
)339 :
;33: ;
}44 	
public66 
async66 
Task66 
<66 
User66 
?66 
>66  
Login66! &
(66& '
string66' -
email66. 3
,663 4
string665 ;
password66< D
)66D E
{77 	!
ArgumentNullException88 !
.88! "
ThrowIfNull88" -
(88- .
email88. 3
)883 4
;884 5!
ArgumentNullException99 !
.99! "
ThrowIfNull99" -
(99- .
password99. 6
)996 7
;997 8
if:: 
(:: 
string:: 
.:: 
IsNullOrWhiteSpace:: )
(::) *
email::* /
)::/ 0
)::0 1
throw;; 
new;; 
ArgumentException;; +
(;;+ ,
$str;;, F
,;;F G
nameof;;H N
(;;N O
email;;O T
);;T U
);;U V
;;;V W
if<< 
(<< 
string<< 
.<< 
IsNullOrWhiteSpace<< )
(<<) *
password<<* 2
)<<2 3
)<<3 4
throw== 
new== 
ArgumentException== +
(==+ ,
$str==, I
,==I J
nameof==K Q
(==Q R
password==R Z
)==Z [
)==[ \
;==\ ]
var?? 
user?? 
=?? 
await?? 
_userRepository?? ,
.??, -
GetByEmailAsync??- <
(??< =
email??= B
)??B C
;??C D
if@@ 
(@@ 
user@@ 
==@@ 
null@@ 
)@@ 
returnAA 
nullAA 
;AA 
ifDD 
(DD 
!DD 
PasswordHasherDD 
.DD  
VerifyPasswordDD  .
(DD. /
passwordDD/ 7
,DD7 8
userDD9 =
.DD= >
PasswordHashDD> J
)DDJ K
)DDK L
returnEE 
nullEE 
;EE 
returnGG 
userGG 
;GG 
}HH 	
publicJJ 
stringJJ 
GenerateJwtTokenJJ &
(JJ& '
UserJJ' +
userJJ, 0
)JJ0 1
{KK 	!
ArgumentNullExceptionLL !
.LL! "
ThrowIfNullLL" -
(LL- .
userLL. 2
)LL2 3
;LL3 4
_jwtSettingsNN 
.NN 
ValidateNN !
(NN! "
)NN" #
;NN# $
varPP 
claimsPP 
=PP 
newPP 
[PP 
]PP 
{QQ 
newRR 
ClaimRR 
(RR 

ClaimTypesRR $
.RR$ %
NameIdentifierRR% 3
,RR3 4
userRR5 9
.RR9 :
IdRR: <
.RR< =
ToStringRR= E
(RRE F
)RRF G
)RRG H
,RRH I
newSS 
ClaimSS 
(SS 

ClaimTypesSS $
.SS$ %
EmailSS% *
,SS* +
userSS, 0
.SS0 1
EmailSS1 6
)SS6 7
,SS7 8
newTT 
ClaimTT 
(TT 

ClaimTypesTT $
.TT$ %
NameTT% )
,TT) *
userTT+ /
.TT/ 0
UsernameTT0 8
)TT8 9
,TT9 :
newUU 
ClaimUU 
(UU 

ClaimTypesUU $
.UU$ %
RoleUU% )
,UU) *
userUU+ /
.UU/ 0
RoleUU0 4
)UU4 5
}VV 
;VV 
varXX 
keyXX 
=XX 
newXX  
SymmetricSecurityKeyXX .
(XX. /
EncodingXX/ 7
.XX7 8
UTF8XX8 <
.XX< =
GetBytesXX= E
(XXE F
_jwtSettingsXXF R
.XXR S
KeyXXS V
)XXV W
)XXW X
;XXX Y
varYY 
credsYY 
=YY 
newYY 
SigningCredentialsYY .
(YY. /
keyYY/ 2
,YY2 3
SecurityAlgorithmsYY4 F
.YYF G

HmacSha256YYG Q
)YYQ R
;YYR S
var[[ 
token[[ 
=[[ 
new[[ 
JwtSecurityToken[[ ,
([[, -
issuer\\ 
:\\ 
_jwtSettings\\ $
.\\$ %
Issuer\\% +
,\\+ ,
audience]] 
:]] 
_jwtSettings]] &
.]]& '
Audience]]' /
,]]/ 0
claims^^ 
:^^ 
claims^^ 
,^^ 
expires__ 
:__ 
DateTime__ !
.__! "
UtcNow__" (
.__( )
AddDays__) 0
(__0 1
_jwtSettings__1 =
.__= >
ExpiryInDays__> J
)__J K
,__K L
signingCredentials`` "
:``" #
creds``$ )
)aa 
;aa 
returncc 
newcc #
JwtSecurityTokenHandlercc .
(cc. /
)cc/ 0
.cc0 1

WriteTokencc1 ;
(cc; <
tokencc< A
)ccA B
;ccB C
}dd 	
}ee 
}ff ˆ
aC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Models\User.cs
	namespace 	
TaskManagement
 
. 
Core 
. 
Models $
{ 
public 

class 
User 
{ 
public 
int 
Id 
{ 
get 
; 
set  
;  !
}" #
public		 
string		 
Username		 
{		  
get		! $
;		$ %
set		& )
;		) *
}		+ ,
=		- .
string		/ 5
.		5 6
Empty		6 ;
;		; <
public

 
string

 
Email

 
{

 
get

 !
;

! "
set

# &
;

& '
}

( )
=

* +
string

, 2
.

2 3
Empty

3 8
;

8 9
public 
string 
PasswordHash "
{# $
get% (
;( )
set* -
;- .
}/ 0
=1 2
string3 9
.9 :
Empty: ?
;? @
public 
string 
Role 
{ 
get  
;  !
set" %
;% &
}' (
=) *
$str+ 8
;8 9
public 
DateTime 
	CreatedAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
=0 1
DateTime2 :
.: ;
UtcNow; A
;A B
public 
DateTime 
? 
	UpdatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
ICollection 
< 
Task 
>  
Tasks! &
{' (
get) ,
;, -
set. 1
;1 2
}3 4
=5 6
new7 :
List; ?
<? @
Task@ D
>D E
(E F
)F G
;G H
} 
} ˙
aC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Models\Task.cs
	namespace 	
TaskManagement
 
. 
Core 
. 
Models $
{ 
public 

class 
Task 
{ 
public		 
int		 
Id		 
{		 
get		 
;		 
set		  
;		  !
}		" #
public

 
string

 
Title

 
{

 
get

 !
;

! "
set

# &
;

& '
}

( )
=

* +
string

, 2
.

2 3
Empty

3 8
;

8 9
public 
string 
? 
Description "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
string 
Status 
{ 
get "
;" #
set$ '
;' (
}) *
=+ ,
$str- 6
;6 7
public 
string 
Priority 
{  
get! $
;$ %
set& )
;) *
}+ ,
=- .
$str/ 7
;7 8
public 
string 
Category 
{  
get! $
;$ %
set& )
;) *
}+ ,
=- .
string/ 5
.5 6
Empty6 ;
;; <
public 
DateTime 
DueDate 
{  !
get" %
;% &
set' *
;* +
}, -
public 
DateTime 
	CreatedAt !
{" #
get$ '
;' (
set) ,
;, -
}. /
=0 1
DateTime2 :
.: ;
UtcNow; A
;A B
public 
DateTime 
? 
	UpdatedAt "
{# $
get% (
;( )
set* -
;- .
}/ 0
public 
int 
UserId 
{ 
get 
;  
set! $
;$ %
}& '
public 
User 
? 
User 
{ 
get 
;  
set! $
;$ %
}& '
} 
} Ü 
hC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Models\JwtSettings.cs
	namespace 	
TaskManagement
 
. 
Core 
. 
Models $
{ 
public 

sealed 
class 
JwtSettings #
{ 
[ 	
Required	 
] 
public		 
string		 
Key		 
{		 
get		 
;		  
set		! $
;		$ %
}		& '
=		( )
string		* 0
.		0 1
Empty		1 6
;		6 7
[ 	
Required	 
] 
public 
string 
Issuer 
{ 
get "
;" #
set$ '
;' (
}) *
=+ ,
string- 3
.3 4
Empty4 9
;9 :
[ 	
Required	 
] 
public 
string 
Audience 
{  
get! $
;$ %
set& )
;) *
}+ ,
=- .
string/ 5
.5 6
Empty6 ;
;; <
[ 	
Range	 
( 
$num 
, 
$num 
) 
] 
public 
int 
ExpiryInDays 
{  !
get" %
;% &
set' *
;* +
}, -
=. /
$num0 1
;1 2
public 
void 
Validate 
( 
) 
{ 	
const 
int 
minimumKeyLength &
=' (
$num) +
;+ ,
if 
( 
string 
. 
IsNullOrWhiteSpace )
() *
Key* -
)- .
). /
throw 
new %
InvalidOperationException 3
(3 4
$str4 f
)f g
;g h
if 
( 
Key 
. 
Length 
< 
minimumKeyLength -
)- .
throw 
new %
InvalidOperationException 3
(3 4
$"4 6
$str6 W
{W X
minimumKeyLengthX h
}h i
$stri z
"z {
){ |
;| }
if 
( 
Key 
== 
$str H
)H I
throw 
new %
InvalidOperationException 3
(3 4
$str	4 ´
)
´ ¨
;
¨ ≠
var!! 
keyBytes!! 
=!! 
Encoding!! #
.!!# $
UTF8!!$ (
.!!( )
GetByteCount!!) 5
(!!5 6
Key!!6 9
)!!9 :
;!!: ;
if"" 
("" 
keyBytes"" 
<"" 
$num"" 
)"" 
throw## 
new## %
InvalidOperationException## 3
(##3 4
$str##4 k
)##k l
;##l m
if%% 
(%% 
string%% 
.%% 
IsNullOrWhiteSpace%% )
(%%) *
Issuer%%* 0
)%%0 1
)%%1 2
throw&& 
new&& %
InvalidOperationException&& 3
(&&3 4
$str&&4 a
)&&a b
;&&b c
if(( 
((( 
string(( 
.(( 
IsNullOrWhiteSpace(( )
((() *
Audience((* 2
)((2 3
)((3 4
throw)) 
new)) %
InvalidOperationException)) 3
())3 4
$str))4 c
)))c d
;))d e
if++ 
(++ 
ExpiryInDays++ 
<++ 
$num++  
||++! #
ExpiryInDays++$ 0
>++1 2
$num++3 6
)++6 7
throw,, 
new,, %
InvalidOperationException,, 3
(,,3 4
$str,,4 `
),,` a
;,,a b
}-- 	
}.. 
}// Ú
mC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\IUserService.cs
	namespace 	
TaskManagement
 
. 
Core 
. 

Interfaces (
{ 
public 

	interface 
IUserService !
{ 
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
User$ (
>( )
CreateAsync* 5
(5 6
User6 :
user; ?
)? @
;@ A
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
User$ (
?( )
>) *
GetByIdAsync+ 7
(7 8
int8 ;
id< >
)> ?
;? @
System		 
.		 
	Threading		 
.		 
Tasks		 
.		 
Task		 #
<		# $
User		$ (
?		( )
>		) *
GetByEmailAsync		+ :
(		: ;
string		; A
email		B G
)		G H
;		H I
System

 
.

 
	Threading

 
.

 
Tasks

 
.

 
Task

 #
<

# $
IEnumerable

$ /
<

/ 0
User

0 4
>

4 5
>

5 6
GetAllAsync

7 B
(

B C
)

C D
;

D E
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
User$ (
>( )
UpdateAsync* 5
(5 6
User6 :
user; ?
)? @
;@ A
System 
. 
	Threading 
. 
Tasks 
. 
Task #
DeleteAsync$ /
(/ 0
int0 3
id4 6
)6 7
;7 8
} 
} ¯
pC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\IUserRepository.cs
	namespace 	
TaskManagement
 
. 
Core 
. 

Interfaces (
{ 
public 

	interface 
IUserRepository $
{ 
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
User$ (
>( )
CreateAsync* 5
(5 6
User6 :
user; ?
)? @
;@ A
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
User$ (
?( )
>) *
GetByIdAsync+ 7
(7 8
int8 ;
id< >
)> ?
;? @
System		 
.		 
	Threading		 
.		 
Tasks		 
.		 
Task		 #
<		# $
User		$ (
?		( )
>		) *
GetByEmailAsync		+ :
(		: ;
string		; A
email		B G
)		G H
;		H I
System

 
.

 
	Threading

 
.

 
Tasks

 
.

 
Task

 #
<

# $
IEnumerable

$ /
<

/ 0
User

0 4
>

4 5
>

5 6
GetAllAsync

7 B
(

B C
)

C D
;

D E
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
User$ (
>( )
UpdateAsync* 5
(5 6
User6 :
user; ?
)? @
;@ A
System 
. 
	Threading 
. 
Tasks 
. 
Task #
DeleteAsync$ /
(/ 0
int0 3
id4 6
)6 7
;7 8
} 
} ®
mC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\ITaskService.cs
	namespace 	
TaskManagement
 
. 
Core 
. 

Interfaces (
{ 
public 

	interface 
ITaskService !
{ 
System

 
.

 
	Threading

 
.

 
Tasks

 
.

 
Task

 #
<

# $

TaskEntity

$ .
>

. /
CreateAsync

0 ;
(

; <

TaskEntity

< F
task

G K
,

K L
int

M P
userId

Q W
)

W X
;

X Y
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $

TaskEntity$ .
?. /
>/ 0
GetByIdAsync1 =
(= >
int> A
idB D
,D E
intF I
userIdJ P
,P Q
boolR V
isAdminW ^
)^ _
;_ `
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
IEnumerable$ /
</ 0

TaskEntity0 :
>: ;
>; <
GetAllAsync= H
(H I
intI L
userIdM S
,S T
boolU Y
isAdminZ a
)a b
;b c
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
IEnumerable$ /
</ 0

TaskEntity0 :
>: ;
>; <
GetByUserIdAsync= M
(M N
intN Q
targetUserIdR ^
,^ _
int` c
requesterUserIdd s
,s t
boolu y
isAdmin	z Å
)
Å Ç
;
Ç É
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $

TaskEntity$ .
?. /
>/ 0
UpdateAsync1 <
(< =
int= @
idA C
,C D

TaskEntityE O
taskP T
,T U
intV Y
userIdZ `
,` a
boolb f
isAdming n
)n o
;o p
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
bool$ (
>( )
DeleteAsync* 5
(5 6
int6 9
id: <
,< =
int> A
userIdB H
,H I
boolJ N
isAdminO V
)V W
;W X
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
IEnumerable$ /
</ 0

TaskEntity0 :
>: ;
>; <
GetFilteredAsync= M
(M N
TaskFilterDtoN [
filter\ b
,b c
intd g
userIdh n
,n o
boolp t
isAdminu |
)| }
;} ~
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $

TaskEntity$ .
?. /
>/ 0
AssignTaskAsync1 @
(@ A
intA D
taskIdE K
,K L
intM P
assignToUserIdQ _
,_ `
inta d
adminUserIde p
,p q
boolr v
isAdminw ~
)~ 
;	 Ä
} 
} ó
pC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\ITaskRepository.cs
	namespace 	
TaskManagement
 
. 
Core 
. 

Interfaces (
{ 
public 

	interface 
ITaskRepository $
{ 
System		 
.		 
	Threading		 
.		 
Tasks		 
.		 
Task		 #
<		# $

TaskEntity		$ .
>		. /
CreateAsync		0 ;
(		; <

TaskEntity		< F
task		G K
)		K L
;		L M
System

 
.

 
	Threading

 
.

 
Tasks

 
.

 
Task

 #
<

# $

TaskEntity

$ .
?

. /
>

/ 0
GetByIdAsync

1 =
(

= >
int

> A
id

B D
)

D E
;

E F
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
IEnumerable$ /
</ 0

TaskEntity0 :
>: ;
>; <
GetAllAsync= H
(H I
)I J
;J K
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
IEnumerable$ /
</ 0

TaskEntity0 :
>: ;
>; <
GetByUserIdAsync= M
(M N
intN Q
userIdR X
)X Y
;Y Z
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $

TaskEntity$ .
>. /
UpdateAsync0 ;
(; <

TaskEntity< F
taskG K
)K L
;L M
System 
. 
	Threading 
. 
Tasks 
. 
Task #
DeleteAsync$ /
(/ 0
int0 3
id4 6
)6 7
;7 8
System 
. 
	Threading 
. 
Tasks 
. 
Task #
<# $
IEnumerable$ /
</ 0

TaskEntity0 :
>: ;
>; <
GetFilteredAsync= M
(M N
TaskFilterDtoN [
filter\ b
,b c
intd g
userIdh n
,n o
boolp t
isAdminu |
)| }
;} ~
} 
} t
rC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\IDashboardService.csÜ
mC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\IAuthService.cs
	namespace 	
TaskManagement
 
. 
Core 
. 

Interfaces (
{ 
public 

	interface 
IAuthService !
{ 
Task

 
<

 
User

 
?

 
>

 
Register

 
(

 
string

 #
username

$ ,
,

, -
string

. 4
email

5 :
,

: ;
string

< B
password

C K
)

K L
;

L M
Task 
< 
User 
? 
> 
Login 
( 
string  
email! &
,& '
string( .
password/ 7
)7 8
;8 9
string 
GenerateJwtToken 
(  
User  $
user% )
)) *
;* +
} 
} ÿ4
lC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Helpers\PasswordHasher.cs
	namespace 	
TaskManagement
 
. 
Core 
. 
Helpers %
{ 
public 

static 
class 
PasswordHasher &
{ 
private 
const 
string 
Pbkdf2Identifier -
=. /
$str0 ?
;? @
private		 
const		 
int		 
SaltSize		 "
=		# $
$num		% '
;		' (
private

 
const

 
int

 
KeySize

 !
=

" #
$num

$ &
;

& '
private 
const 
int 

Iterations $
=% &
$num' .
;. /
public 
static 
string 
HashPassword )
() *
string* 0
password1 9
)9 :
{ 	!
ArgumentNullException !
.! "
ThrowIfNull" -
(- .
password. 6
)6 7
;7 8
using 
var 
deriveBytes !
=" #
new$ '
Rfc2898DeriveBytes( :
(: ;
password; C
,C D
SaltSizeE M
,M N

IterationsO Y
,Y Z
HashAlgorithmName[ l
.l m
SHA256m s
)s t
;t u
var 
salt 
= 
deriveBytes "
." #
Salt# '
;' (
var 
key 
= 
deriveBytes !
.! "
GetBytes" *
(* +
KeySize+ 2
)2 3
;3 4
return 
string 
. 
Join 
( 
$char "
," #
Pbkdf2Identifier$ 4
,4 5

Iterations6 @
,@ A
ConvertB I
.I J
ToBase64StringJ X
(X Y
saltY ]
)] ^
,^ _
Convert` g
.g h
ToBase64Stringh v
(v w
keyw z
)z {
){ |
;| }
} 	
public 
static 
bool 
VerifyPassword )
() *
string* 0
password1 9
,9 :
string; A
hashedPasswordB P
)P Q
{ 	!
ArgumentNullException   !
.  ! "
ThrowIfNull  " -
(  - .
password  . 6
)  6 7
;  7 8!
ArgumentNullException!! !
.!!! "
ThrowIfNull!!" -
(!!- .
hashedPassword!!. <
)!!< =
;!!= >
if## 
(## 
hashedPassword## 
.## 

StartsWith## )
(##) *
Pbkdf2Identifier##* :
+##; <
$char##= @
,##@ A
StringComparison##B R
.##R S
Ordinal##S Z
)##Z [
)##[ \
{$$ 
var%% 
parts%% 
=%% 
hashedPassword%% *
.%%* +
Split%%+ 0
(%%0 1
$char%%1 4
,%%4 5
$num%%6 7
)%%7 8
;%%8 9
if&& 
(&& 
parts&& 
.&& 
Length&&  
!=&&! #
$num&&$ %
)&&% &
return'' 
false''  
;''  !
if)) 
()) 
!)) 
int)) 
.)) 
TryParse)) !
())! "
parts))" '
[))' (
$num))( )
]))) *
,))* +
out)), /
var))0 3

iterations))4 >
)))> ?
||))@ B

iterations))C M
<=))N P
$num))Q R
)))R S
return** 
false**  
;**  !
try,, 
{-- 
var.. 
salt.. 
=.. 
Convert.. &
...& '
FromBase64String..' 7
(..7 8
parts..8 =
[..= >
$num..> ?
]..? @
)..@ A
;..A B
var// 
	storedKey// !
=//" #
Convert//$ +
.//+ ,
FromBase64String//, <
(//< =
parts//= B
[//B C
$num//C D
]//D E
)//E F
;//F G
using11 
var11 
deriveBytes11 )
=11* +
new11, /
Rfc2898DeriveBytes110 B
(11B C
password11C K
,11K L
salt11M Q
,11Q R

iterations11S ]
,11] ^
HashAlgorithmName11_ p
.11p q
SHA25611q w
)11w x
;11x y
var22 
computedKey22 #
=22$ %
deriveBytes22& 1
.221 2
GetBytes222 :
(22: ;
	storedKey22; D
.22D E
Length22E K
)22K L
;22L M
return44 #
CryptographicOperations44 2
.442 3
FixedTimeEquals443 B
(44B C
computedKey44C N
,44N O
	storedKey44P Y
)44Y Z
;44Z [
}55 
catch66 
(66 
FormatException66 &
)66& '
{77 
return88 
false88  
;88  !
}99 
}:: 
try== 
{>> 
using?? 
var?? 
sha256??  
=??! "
SHA256??# )
.??) *
Create??* 0
(??0 1
)??1 2
;??2 3
var@@ 
computedHash@@  
=@@! "
sha256@@# )
.@@) *
ComputeHash@@* 5
(@@5 6
Encoding@@6 >
.@@> ?
UTF8@@? C
.@@C D
GetBytes@@D L
(@@L M
password@@M U
)@@U V
)@@V W
;@@W X
varAA 
computedBase64AA "
=AA# $
ConvertAA% ,
.AA, -
ToBase64StringAA- ;
(AA; <
computedHashAA< H
)AAH I
;AAI J
returnBB #
CryptographicOperationsBB .
.BB. /
FixedTimeEqualsBB/ >
(BB> ?
EncodingCC 
.CC 
UTF8CC !
.CC! "
GetBytesCC" *
(CC* +
computedBase64CC+ 9
)CC9 :
,CC: ;
EncodingDD 
.DD 
UTF8DD !
.DD! "
GetBytesDD" *
(DD* +
hashedPasswordDD+ 9
)DD9 :
)DD: ;
;DD; <
}EE 
catchFF 
{GG 
returnHH 
falseHH 
;HH 
}II 
}JJ 	
}KK 
}LL ≤
hC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\DTOs\TaskFilterDto.cs
	namespace 	
TaskManagement
 
. 
Core 
. 
DTOs "
{ 
public 

class 
TaskFilterDto 
{ 
public 
string 
? 
Status 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
? 
Priority 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
? 
Category 
{  !
get" %
;% &
set' *
;* +
}, -
public 
string 
? 
Search 
{ 
get  #
;# $
set% (
;( )
}* +
public		 
DateTime		 
?		 
DueDateFrom		 $
{		% &
get		' *
;		* +
set		, /
;		/ 0
}		1 2
public

 
DateTime

 
?

 
	DueDateTo

 "
{

# $
get

% (
;

( )
set

* -
;

- .
}

/ 0
public 
string 
? 
SortBy 
{ 
get  #
;# $
set% (
;( )
}* +
public 
string 
? 
	SortOrder  
{! "
get# &
;& '
set( +
;+ ,
}- .
} 
} í
\C:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Class1.cs
	namespace 	
TaskManagement
 
. 
Core 
; 
public 
class 
Class1 
{ 
} 