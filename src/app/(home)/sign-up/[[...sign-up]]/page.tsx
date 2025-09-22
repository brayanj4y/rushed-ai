import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <SignUp />
    </div>
  )
}
