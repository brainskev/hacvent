import { SignIn } from '@clerk/nextjs'
import Layout from '@/components/Layout'

export default function SignInPage() {
  return (
    <Layout>
      <div className="container-custom py-14">
        <div className="max-w-md mx-auto">
          <SignIn 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-lg border border-gray-200 rounded-xl',
              }
            }}
            redirectUrl="/customer-dashboard"
          />
        </div>
      </div>
    </Layout>
  )
}
