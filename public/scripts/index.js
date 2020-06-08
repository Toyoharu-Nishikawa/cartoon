import {initialize} from "./gui/index.js"
import {login} from "/necoengine/scripts/necoengine/login/index.js"

"use ustrict"
login.setLoginButton()
login.visit()

initialize()

