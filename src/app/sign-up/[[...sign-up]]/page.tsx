import { SignUp } from '@clerk/nextjs'
import Layout from '@/components/Layout'

export default function SignUpPage() {
  return (
    <Layout>
      <div className="container-custom py-14">
        <div className="max-w-md mx-auto">
          <SignUp 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-lg border border-gray-200 rounded-xl',
              }
            }}
            redirectUrl="/customer-intake"
          />
        </div>
      </div>
    </Layout>
  )
}
