import { stackServerApp } from "@/stack"

export default function SecurityHandler() {
    stackServerApp.getUser({"or":"redirect"})  
    return null
}