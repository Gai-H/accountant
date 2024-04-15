import { Nav } from "./nav"

function Settings() {
  return (
    <>
      <p className="hidden md:block grow">左のメニューから変更したい項目を選択してください</p>
      <div className="md:hidden">
        <Nav />
      </div>
    </>
  )
}

export default Settings
